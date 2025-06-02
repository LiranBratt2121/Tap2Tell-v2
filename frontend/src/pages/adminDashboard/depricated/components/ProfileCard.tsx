import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    Grid,
    DataItem,
    Label,
    Value
} from '../adminDashboard.styles';
import { UserActivityData, FirebaseUserInformationData } from '../adminDashboard.types';

const ProfileCard = (userActivityData: UserActivityData, FirebaseUserInformationData: FirebaseUserInformationData) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <Grid>
                    <DataItem>
                        <Label>User ID</Label>
                        <Value>{userActivityData.userId}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>Role</Label>
                        <Value style={{ textTransform: 'capitalize' }}>{FirebaseUserInformationData.role}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>First Login</Label>
                        <Value>{FirebaseUserInformationData.isFirstLogin ? "Yes" : "No"}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>Active Since</Label>
                        <Value>{userActivityData.createdAt}</Value>
                    </DataItem>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
