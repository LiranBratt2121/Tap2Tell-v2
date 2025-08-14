import { useState } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { SectionTitle, SearchContainer, SearchInput, SearchButton, ErrorMessage, LoadingSpinner } from "../../v2/adminDashboard.styles";
import { UserSearchResults } from "./UserSearchResult";
import { useUserSearch } from "../../hooks/useUserSearch";

export const UserSearch: React.FC = () => {
    const [searchId, setSearchId] = useState<string>('');
    const { searchResult, searchLoading, searchError, searchUser } = useUserSearch();
    const { loading, refreshing } = useDashboard();

    const handleSearch = () => searchUser(searchId);
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <>
            <SectionTitle>חיפוש משתמש לפי User ID</SectionTitle>
            <SearchContainer>
                <SearchInput
                    type="text"
                    placeholder="הכנס מספר משתמש לחיפוש (USER ID)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading || refreshing || searchLoading}
                />
                <SearchButton onClick={handleSearch} disabled={loading || refreshing || searchLoading}>
                    {searchLoading ? 'מחפש...' : 'חפש'}
                </SearchButton>
            </SearchContainer>

            {searchError && <ErrorMessage>{searchError}</ErrorMessage>}
            {searchLoading && <LoadingSpinner>מחפש משתמש...</LoadingSpinner>}

            {searchResult && <UserSearchResults result={searchResult} />}
        </>
    );
};