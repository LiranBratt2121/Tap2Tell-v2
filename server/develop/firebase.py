import os
from typing import List
import firebase_admin
from firebase_admin import credentials, storage
from google.cloud.storage import Bucket
from google.cloud.storage import Blob

# --- Firebase Initialization (Best Practice) ---
SERVICE_ACCOUNT_KEY_PATH = 'develop/tap2-fc536-firebase-adminsdk-ih7g5-5c0cce0069.json'

# Get this from your Firebase Console -> Storage (usually your-project-id.appspot.com)
# **** CORRECTED BUCKET NAME ****
FIREBASE_BUCKET_NAME = 'tap2-fc536.firebasestorage.app' # <--- Use the name from your screenshot

_firebase_initialized = False

def initialize_firebase_once():
    """Initializes the Firebase Admin SDK only if not already initialized."""
    global _firebase_initialized
    if _firebase_initialized:
        return True

    if not os.path.exists(SERVICE_ACCOUNT_KEY_PATH):
        print(f"Error: Service account key file not found at '{SERVICE_ACCOUNT_KEY_PATH}'")
        return False

    try:
        cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
        # **** Ensure initialization uses the CORRECTED BUCKET NAME ****
        firebase_admin.initialize_app(cred, {
            'storageBucket': FIREBASE_BUCKET_NAME
        })
        print(f"Firebase App initialized successfully for bucket '{FIREBASE_BUCKET_NAME}'.")
        _firebase_initialized = True
        return True
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        _firebase_initialized = False
        return False

# --- Function to Download All Files ---
def download_all_files_from_bucket(local_download_dir: str):
    """
    Downloads all files from the configured Firebase Storage bucket
    to a specified local directory, preserving the folder structure.
    """
    if not initialize_firebase_once():
        print("Cannot proceed without Firebase initialization.")
        return

    try:
        # **** CORRECTED: Use the default bucket from initialization ****
        # **** Remove the argument here ****
        bucket: Bucket = storage.bucket()
        if not bucket:
            print("Error: Could not get storage bucket.")
            return
    except Exception as e:
        print(f"Error accessing storage bucket: {e}")
        return

    print(f"\nStarting download from bucket '{bucket.name}' to '{local_download_dir}'...")

    # Ensure the base local directory exists
    os.makedirs(local_download_dir, exist_ok=True)

    # Use bucket.list_blobs() which returns an iterator directly
    blobs_iterator = bucket.list_blobs()

    downloaded_count = 0
    error_count = 0
    skipped_count = 0

    for blob in blobs_iterator: # Iterate directly over the iterator
        local_file_path = os.path.join(local_download_dir, blob.name)

        if blob.name.endswith('/'):
            # print(f"Skipping directory placeholder: {blob.name}") # Optional: Less verbose
            skipped_count += 1
            continue

        local_blob_dir = os.path.dirname(local_file_path)
        if local_blob_dir:
            os.makedirs(local_blob_dir, exist_ok=True)

        try:
            print(f"Downloading: {blob.name}  ->  {local_file_path}")
            blob.download_to_filename(local_file_path)
            downloaded_count += 1
        except Exception as e:
            print(f"!!! Error downloading {blob.name}: {e}")
            error_count += 1

    print("\n----- Download Summary -----")
    print(f"Successfully downloaded: {downloaded_count} files")
    print(f"Skipped (likely folders): {skipped_count} items")
    print(f"Errors encountered:     {error_count} files")
    print("--------------------------")


def flatten_directory(source_folder, destination_folder):
    """
    Copies all files from source_folder and its subdirectories
    into a single destination_folder.

    Args:
        source_folder (str): The path to the folder containing files and subfolders.
        destination_folder (str): The path to the folder where all files will be copied.
    """
    import os
    import shutil
    import sys

    # --- Basic Input Validation ---
    if not os.path.isdir(source_folder):
        print(f"Error: Source folder '{source_folder}' not found or is not a directory.")
        return

    # --- Prevent Destination Inside Source (common mistake) ---
    abs_source = os.path.abspath(source_folder)
    abs_destination = os.path.abspath(destination_folder)
    if abs_destination.startswith(abs_source) and abs_destination != abs_source:
         print(f"Error: Destination folder '{destination_folder}' cannot be inside the source folder '{source_folder}'.")
         return

    # --- Create Destination Folder ---
    try:
        # exist_ok=True prevents an error if the folder already exists
        os.makedirs(destination_folder, exist_ok=True)
        print(f"Ensured destination folder exists: '{destination_folder}'")
    except OSError as e:
        print(f"Error creating destination folder '{destination_folder}': {e}")
        return

    # --- Walk Through Source Directory ---
    files_copied = 0
    files_overwritten = 0
    files_skipped_same = 0 # Count files skipped because they are identical

    print(f"Starting scan of '{source_folder}'...")

    for dirpath, dirnames, filenames in os.walk(source_folder):
        # Skip the destination folder if it happens to be walked over
        # (This check is another layer of safety, especially if the user ignores the earlier warning)
        if os.path.abspath(dirpath).startswith(abs_destination):
            print(f"  Skipping walk into destination directory: {dirpath}")
            # Prevent os.walk from going into subdirs of destination
            dirnames[:] = []
            continue

        print(f"  Scanning: {dirpath}") # Show progress

        for filename in filenames:
            source_file_path = os.path.join(dirpath, filename)
            destination_file_path = os.path.join(destination_folder, filename)

            # --- Handle Potential Filename Collisions ---
            if os.path.exists(destination_file_path):
                try:
                    # Check if files are actually identical before overwriting/skipping
                    # os.path.samefile might work on some OSes, stat is more reliable
                    source_stat = os.stat(source_file_path)
                    dest_stat = os.stat(destination_file_path)
                    if source_stat.st_ino == dest_stat.st_ino and source_stat.st_dev == dest_stat.st_dev:
                         # This means it's the exact same file (hard link or source == destination)
                         print(f"    Skipping '{filename}' (Source and destination are the same file).")
                         files_skipped_same +=1
                         continue # Don't copy over self
                    elif source_stat.st_size == dest_stat.st_size and \
                         os.path.getmtime(source_file_path) == os.path.getmtime(destination_file_path):
                         # If size and modification time match, assume it's the same content
                         print(f"    Skipping '{filename}' (Identical file already exists in destination).")
                         files_skipped_same += 1
                         continue
                    else:
                        print(f"    Warning: Overwriting existing file in destination: '{filename}'")
                        files_overwritten += 1
                except FileNotFoundError:
                     # This shouldn't happen if os.path.exists was true, but handle defensively
                     print(f"    Warning: File disappeared before stat check? Proceeding with copy for '{filename}'.")
                     pass # Proceed to copy

            # --- Copy the File ---
            try:
                # shutil.copy2 preserves more metadata (like modification time) than shutil.copy
                shutil.copy2(source_file_path, destination_file_path)
                print(f"    Copied: '{filename}'")
                files_copied += 1
            except Exception as e:
                print(f"    Error copying file '{filename}': {e}")

    # --- Summary ---
    print("\n--- Flattening Complete ---")
    print(f"Files successfully copied: {files_copied}")
    print(f"Files overwritten in destination: {files_overwritten}")
    print(f"Files skipped (identical already existed): {files_skipped_same}")
    print(f"Source folder: '{source_folder}'")
    print(f"Destination folder: '{destination_folder}'")



if __name__ == "__main__":
    DOWNLOAD_DIRECTORY = './firebase_storage_backup'
    download_all_files_from_bucket(DOWNLOAD_DIRECTORY)