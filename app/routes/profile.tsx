import { useEffect, useState } from "react";

import {
  getUserById, updateUser
} from "~/lib/database";
import {
  Container, Title, Text, Card, Group, Button, Stack,
  TextInput, LoadingOverlay, Alert, Box, Avatar, 
  useMantineTheme, Divider, Paper, Grid, GridCol
} from '@mantine/core';
import {
  IconUser, IconMail, IconClock, IconCrown, IconEdit, 
  IconAlertCircle, IconCheck, IconPhoto
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function meta() {
  return [
    { title: "Profile - Kenton County Animal Shelter" },
    { name: "description", content: "View and edit your profile information." },
  ];
}

export default function Profile() {
  const theme = useMantineTheme();

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('currentUser');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };
  
  const currentUser = getCurrentUser();

  // Form for editing profile
  const profileForm = useForm({
    initialValues: {
      name: '',
      email: '',
      profile_photo_url: ''
    },
    validate: {
      name: (value) => value.trim().length === 0 ? 'Name is required' : null,
      email: (value) => !/^\S+@\S+$/.test(value) ? 'Invalid email' : null,
    }
  });

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    try {
      setLoading(true);
      
      if (!currentUser?.id) {
        setError('User not authenticated');
        return;
      }

      const userDataFromDB = await getUserById(currentUser.id);
      setUserData(userDataFromDB);
      
      // Set form values
      profileForm.setValues({
        name: userDataFromDB.name || '',
        email: userDataFromDB.email || '',
        profile_photo_url: userDataFromDB.profile_photo_url || ''
      });

    } catch (err) {
      console.error('Error loading user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  }

  const handleSaveProfile = async (values: any) => {
    try {
      setSaving(true);
      
      if (!currentUser?.id) {
        notifications.show({
          title: 'Error',
          message: 'User not authenticated',
          color: 'red'
        });
        return;
      }

      const updatedUser = await updateUser(currentUser.id, {
        name: values.name,
        email: values.email,
        profile_photo_url: values.profile_photo_url
      });

      setUserData(updatedUser);
      setIsEditing(false);
      
      // Update localStorage with new name
      const updatedLocalUser = {
        ...currentUser,
        name: values.name,
        email: values.email
      };
      localStorage.setItem('currentUser', JSON.stringify(updatedLocalUser));

      notifications.show({
        title: 'Success',
        message: 'Profile updated successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update profile',
        color: 'red'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form to original values
    profileForm.setValues({
      name: userData?.name || '',
      email: userData?.email || '',
      profile_photo_url: userData?.profile_photo_url || ''
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Container size="xl" py="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="xl">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box pos="relative" style={{ backgroundColor: theme.colors.background[0] }}>
      <Container size="xl">
        <Grid gutter="lg">
          {/* Profile Header */}
          <GridCol span={12}>
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Group justify="space-between" align="flex-start" mb="lg">
                <Group>
                  <Avatar 
                    size="xl" 
                    src={userData?.profile_photo_url} 
                    color="orange"
                    radius="xl"
                  >
                    {userData?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Title order={2} size="h3" mb="xs">{userData?.name || 'Unknown User'}</Title>
                    <Text size="lg" c="dimmed" mb="xs">{userData?.email}</Text>
                    <Group gap="xs">
                      <IconCrown size={16} color="var(--mantine-color-orange-6)" />
                      <Text size="sm" fw={500} style={{ textTransform: 'capitalize' }}>
                        {userData?.role || 'Unknown Role'}
                      </Text>
                    </Group>
                  </Box>
                </Group>
              </Group>

              {/* Stats */}
              <Group gap="xl">
                <Paper p="md" withBorder radius="md" style={{ flex: 1 }}>
                  <Group gap="xs" mb="xs">
                    <IconClock size={20} color="var(--mantine-color-blue-6)" />
                    <Text fw={600} size="lg">Total Hours</Text>
                  </Group>
                  <Text size="xl" fw={700} c="blue">{userData?.total_hours || 0}</Text>
                  <Text size="sm" c="dimmed">Volunteer hours</Text>
                </Paper>
              </Group>
            </Card>
          </GridCol>

          {/* Profile Details */}
          <GridCol span={{ base: 12, lg: 8 }}>
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Group justify="space-between" align="center" mb="lg">
                <Title order={3} size="h4">Profile Information</Title>
                {!isEditing ? (
                  <Button
                    leftSection={<IconEdit size={16} />}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                ) : (
                  <Group gap="xs">
                    <Button variant="light" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => profileForm.onSubmit(handleSaveProfile)()}
                      loading={saving}
                      leftSection={<IconCheck size={16} />}
                    >
                      Save Changes
                    </Button>
                  </Group>
                )}
              </Group>

                             {!isEditing ? (
                 <Stack gap="lg">
                   <Box>
                     <Group gap="xs" mb="xs">
                       <IconUser size={16} color="var(--mantine-color-blue-6)" />
                       <Text size="sm" c="dimmed">Full Name</Text>
                     </Group>
                     <Text size="md" fw={500}>{userData?.name || 'Not provided'}</Text>
                   </Box>

                   <Box>
                     <Group gap="xs" mb="xs">
                       <IconMail size={16} color="var(--mantine-color-blue-6)" />
                       <Text size="sm" c="dimmed">Email Address</Text>
                     </Group>
                     <Text size="md" fw={500}>{userData?.email || 'Not provided'}</Text>
                   </Box>

                   <Box>
                     <Group gap="xs" mb="xs">
                       <IconPhoto size={16} color="var(--mantine-color-blue-6)" />
                       <Text size="sm" c="dimmed">Profile Photo URL</Text>
                     </Group>
                     {userData?.profile_photo_url ? (
                       <Text component="a" href={userData.profile_photo_url} target="_blank" c="blue" style={{ textDecoration: 'underline' }}>
                         View Photo
                       </Text>
                     ) : (
                       <Text size="md" fw={500}>Not provided</Text>
                     )}
                   </Box>

                   <Box>
                     <Group gap="xs" mb="xs">
                       <IconCrown size={16} color="var(--mantine-color-orange-6)" />
                       <Text size="sm" c="dimmed">Role</Text>
                     </Group>
                     <Text size="md" fw={500} style={{ textTransform: 'capitalize' }}>
                       {userData?.role || 'Unknown'}
                     </Text>
                   </Box>

                   <Box>
                     <Group gap="xs" mb="xs">
                       <IconClock size={16} color="var(--mantine-color-blue-6)" />
                       <Text size="sm" c="dimmed">Total Hours</Text>
                     </Group>
                     <Text size="md" fw={500}>{userData?.total_hours || 0} hours</Text>
                   </Box>
                 </Stack>
               ) : (
                 <form onSubmit={profileForm.onSubmit(handleSaveProfile)}>
                   <Stack gap="lg">
                     <TextInput
                       label="Full Name"
                       placeholder="Enter your full name"
                       leftSection={<IconUser size={16} />}
                       {...profileForm.getInputProps('name')}
                       required
                     />

                     <TextInput
                       label="Email Address"
                       placeholder="Enter your email"
                       leftSection={<IconMail size={16} />}
                       {...profileForm.getInputProps('email')}
                       required
                     />

                     <TextInput
                       label="Profile Photo URL"
                       placeholder="Enter URL for profile photo"
                       leftSection={<IconPhoto size={16} />}
                       {...profileForm.getInputProps('profile_photo_url')}
                     />

                     <TextInput
                       label="Role"
                       value={userData?.role || 'Unknown'}
                       leftSection={<IconCrown size={16} />}
                       disabled
                       style={{ textTransform: 'capitalize' }}
                     />

                     <TextInput
                       label="Total Hours"
                       value={userData?.total_hours || 0}
                       leftSection={<IconClock size={16} />}
                       disabled
                     />
                   </Stack>
                 </form>
               )}
            </Card>
          </GridCol>

          {/* Account Info */}
          <GridCol span={{ base: 12, lg: 4 }}>
            <Card shadow="sm" padding="xl" radius="md" withBorder>
              <Title order={3} size="h4" mb="lg">Account Information</Title>
              
                             <Stack gap="md">
                 <Box>
                   <Text size="sm" c="dimmed" mb="xs">Member Since</Text>
                   <Text size="sm" fw={500}>
                     {userData?.created_at ? 
                       new Date(userData.created_at).toLocaleDateString() : 
                       'Unknown'
                     }
                   </Text>
                 </Box>

                 <Divider />

                 <Box>
                   <Text size="sm" c="dimmed" mb="xs">Last Updated</Text>
                   <Text size="sm" fw={500}>
                     {userData?.updated_at ? 
                       new Date(userData.updated_at).toLocaleDateString() : 
                       'Unknown'
                     }
                   </Text>
                 </Box>
               </Stack>
            </Card>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
