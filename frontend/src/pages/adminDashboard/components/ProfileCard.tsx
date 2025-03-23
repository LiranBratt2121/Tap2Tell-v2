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
import { UserActivityData, UserInformationData } from '../adminDashboard.types';

const ProfileCard = (userActivityData: UserActivityData, userInformationData: UserInformationData) => {
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
                        <Value style={{ textTransform: 'capitalize' }}>{userInformationData.role}</Value>
                    </DataItem>
                    <DataItem>
                        <Label>First Login</Label>
                        <Value>{userInformationData.isFirstLogin ? "Yes" : "No"}</Value>
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
