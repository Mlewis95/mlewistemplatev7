import { useEffect, useState } from "react";
import type { Route } from "./+types/dashboard";
import {
  getTasks, getDogsForWalking, getDogWalks, createDogWalk,
  getMessages, getComments, createMessage, createComment,
  updateTask, deleteTask, createTask, getUserById
} from "~/lib/database";
import {
  Container, Title, Text, Card, Group, Button, Badge, Stack,
  TextInput, Textarea, Select, Modal, LoadingOverlay, Alert,
  ActionIcon, Box, Divider, Paper, ScrollArea, Grid, GridCol,
  ThemeIcon, RingProgress, List, Avatar, Flex, Space, useMantineTheme, rem
} from '@mantine/core';
import {
  IconPlus, IconEdit, IconTrash, IconDog, IconMessage, IconList,
  IconCalendar, IconClock, IconUser, IconAlertCircle, IconCheck, IconX
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Volunteer Dashboard - Kenton County Animal Shelter" },
    { name: "description", content: "Volunteer dashboard for managing tasks, dog walks, and communications." },
  ];
}

export default function Dashboard() {
  const theme = useMantineTheme();

  // State for tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showAddTask, setShowAddTask] = useState(false);

  // State for dog walking
  const [dogs, setDogs] = useState<any[]>([]);
  const [dogWalks, setDogWalks] = useState<any[]>([]);

  // State for messages
  const [messages, setMessages] = useState<any[]>([]);
  const [comments, setComments] = useState<{[key: string]: any[]}>({});
  const [showAddMessage, setShowAddMessage] = useState(false);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  const [userData, setUserData] = useState<any>(null);

  // Form for adding tasks
  const taskForm = useForm({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      notes: ''
    },
    validate: {
      title: (value) => value.trim().length === 0 ? 'Title is required' : null,
      priority: (value) => !value ? 'Priority is required' : null
    }
  });

  // Form for editing tasks
  const editTaskForm = useForm({
    initialValues: {
      title: '',
      description: '',
      priority: 'medium',
      notes: ''
    }
  });

  // Form for dog walking
  const walkForm = useForm({
    initialValues: {
      dog_id: '',
      walk_date: '',
      start_time: '',
      duration: '30',
      notes: ''
    },
    validate: {
      dog_id: (value) => !value ? 'Please select a dog' : null,
      walk_date: (value) => !value ? 'Date is required' : null,
      start_time: (value) => !value ? 'Start time is required' : null
    }
  });

  // Form for messages
  const messageForm = useForm({
    initialValues: {
      title: '',
      content: ''
    },
    validate: {
      title: (value) => value.trim().length === 0 ? 'Title is required' : null,
      content: (value) => value.trim().length === 0 ? 'Content is required' : null
    }
  });

  // Form for comments
  const commentForm = useForm({
    initialValues: {
      content: ''
    },
    validate: {
      content: (value) => value.trim().length === 0 ? 'Comment is required' : null
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Load user data if we have a current user
      let userDataFromDB = null;
      if (currentUser?.id) {
        try {
          userDataFromDB = await getUserById(currentUser.id);
          setUserData(userDataFromDB);
        } catch (err) {
          console.error('Error loading user data:', err);
        }
      }
      
      const [tasksData, dogsData, walksData, messagesData] = await Promise.all([
        getTasks(),
        getDogsForWalking(),
        getDogWalks(currentUser?.id),
        getMessages()
      ]);

      setTasks(tasksData);
      setDogs(dogsData);
      setDogWalks(walksData);
      setMessages(messagesData);

      // Load comments for each message
      const commentsData: {[key: string]: any[]} = {};
      for (const message of messagesData) {
        commentsData[message.message_id] = await getComments(message.message_id);
      }
      setComments(commentsData);

    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  // Task functions
  const handleAddTask = async (values: any) => {
    try {
      const newTask = await createTask({
        title: values.title,
        description: values.description,
        priority: values.priority,
        notes: values.notes,
        created_by: currentUser?.id || ''
      });
      setTasks([...tasks, newTask]);
      setShowAddTask(false);
      taskForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Task created successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create task',
        color: 'red'
      });
    }
  };

  const handleUpdateTask = async (values: any) => {
    try {
      const updatedTask = await updateTask(editingTask.task_id, {
        title: values.title,
        description: values.description,
        priority: values.priority,
        notes: values.notes
      });
      setTasks(tasks.map(task => task.task_id === editingTask.task_id ? updatedTask : task));
      setEditingTask(null);
      editTaskForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Task updated successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update task',
        color: 'red'
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.task_id !== taskId));
      notifications.show({
        title: 'Success',
        message: 'Task deleted successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete task',
        color: 'red'
      });
    }
  };

  // Dog walking functions
  const handleSubmitWalk = async (values: any) => {
    try {
      const newWalk = await createDogWalk({
        user_id: currentUser?.id || '',
        dog_id: values.dog_id,
        walk_date: values.walk_date,
        time_start: values.start_time,
        duration: values.duration,
        notes: values.notes
      });
      setDogWalks([newWalk, ...dogWalks]);
      walkForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Walk logged successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to log walk',
        color: 'red'
      });
    }
  };

  // Message functions
  const handleAddMessage = async (values: any) => {
    try {
      const newMessage = await createMessage({
        content: `${values.title}\n\n${values.content}`,
        posted_by: currentUser?.id || ''
      });
      setMessages([newMessage, ...messages]);
      setShowAddMessage(false);
      messageForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Announcement posted successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to post announcement',
        color: 'red'
      });
    }
  };

  const handleAddComment = async (messageId: string, content: string) => {
    try {
      const newComment = await createComment({
        message_id: messageId,
        content: content,
        posted_by: currentUser?.id || ''
      });
      setComments({
        ...comments,
        [messageId]: [...(comments[messageId] || []), newComment]
      });
      commentForm.reset();
      notifications.show({
        title: 'Success',
        message: 'Comment added successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to add comment',
        color: 'red'
      });
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'yellow';
      case 4: return 'blue';
      case 5: return 'green';
      default: return 'gray';
    }
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1: return 'Critical';
      case 2: return 'High';
      case 3: return 'Medium';
      case 4: return 'Low';
      case 5: return 'Very Low';
      default: return 'Unknown';
    }
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
      <LoadingOverlay visible={loading} />
      <Container size="xl">
        <Grid gutter="md">
          {/* Left Sidebar - Quick Actions & Stats */}
          <GridCol span={{ base: 12, lg: 3 }}>
            <Stack gap="md">
              {/* User Stats */}
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Group justify="space-between">
                  <Group align="center" mb="sm">
                                         <Avatar size="md" src={userData?.profile_photo_url || currentUser?.profile_photo_url} color="orange">
                       {currentUser?.name.split(' ').map((n: string) => n[0]).join('') || 'U'}
                     </Avatar>
                     <Box>
                       <Text fw={600} size="sm">{currentUser?.name || 'Unknown User'}</Text>
                       <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
                         {currentUser?.role || 'Unknown'}
                       </Text>
                     </Box>
                   </Group>
                   <Group justify="space-between">
                     <Box>
                       <Text size="xs" c="dimmed">Total Hours</Text>
                       <Text fw={700} size="lg">{userData?.total_hours || 0}</Text>
                     </Box>
                   </Group>
                </Group>
              </Card>

              {/* Quick Actions */}
              <Card shadow="sm" padding="md" radius="md" withBorder>
                <Text fw={600} size="sm" mb="sm">Quick Actions</Text>
                <Stack gap="xs">
                  <Button
                    leftSection={<IconPlus size={14} />}
                    variant="light"
                    size="sm"
                    onClick={() => setShowAddTask(true)}
                    disabled={currentUser?.role !== 'manager'}
                    fullWidth
                  >
                    Add Task
                  </Button>
                  <Button
                    leftSection={<IconMessage size={14} />}
                    variant="light"
                    size="sm"
                    onClick={() => setShowAddMessage(true)}
                    disabled={currentUser?.role !== 'manager'}
                    fullWidth
                  >
                    Post Announcement
                  </Button>
                  <Button
                    leftSection={<IconDog size={14} />}
                    variant="light"
                    size="sm"
                    onClick={() => document.getElementById('walk-form')?.scrollIntoView({ behavior: 'smooth' })}
                    fullWidth
                  >
                    Log Dog Walk
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </GridCol>

          {/* Main Content */}
          <GridCol span={{ base: 12, lg: 9 }}>
            <Grid gutter="md">
              {/* Daily Tasks Section */}
              <GridCol span={{ base: 12, lg: 6 }}>
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Group justify="space-between" align="center" mb="sm">
                    <Group gap="xs">
                      <ThemeIcon size="md" variant="light" color="orange">
                        <IconList size={16} />
                      </ThemeIcon>
                      <Text fw={600} size="sm">Daily Tasks</Text>
                    </Group>
                    {currentUser?.role === 'manager' && (
                      <Button
                        size="xs"
                        leftSection={<IconPlus size={12} />}
                        onClick={() => setShowAddTask(true)}
                      >
                        Add
                      </Button>
                    )}
                  </Group>
                  <Stack gap="sm">
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <Paper key={task.task_id} p="sm" withBorder radius="md">
                          <Group justify="space-between" align="flex-start">
                            <Box style={{ flex: 1 }}>
                              <Group gap="xs" mb="xs">
                                <Text fw={600} size="sm">{task.title}</Text>
                                <Badge color={getPriorityColor(task.priority)} variant="light" size="xs">
                                  {getPriorityLabel(task.priority)}
                                </Badge>
                              </Group>
                              {task.description && (
                                <Text size="xs" c="dimmed" mb="xs">
                                  {task.description}
                                </Text>
                              )}
                              {task.notes && (
                                <Text size="xs" c="blue" style={{ fontStyle: 'italic' }}>
                                  Note: {task.notes}
                                </Text>
                              )}
                            </Box>
                            {currentUser?.role === 'manager' && (
                              <Group gap="xs">
                                <ActionIcon
                                  size="xs"
                                  variant="light"
                                  color="blue"
                                  onClick={() => {
                                    setEditingTask(task);
                                    editTaskForm.setValues({
                                      title: task.title,
                                      description: task.description || '',
                                      priority: task.priority.toString(),
                                      notes: task.notes || ''
                                    });
                                  }}
                                >
                                  <IconEdit size={12} />
                                </ActionIcon>
                                <ActionIcon
                                  size="xs"
                                  variant="light"
                                  color="red"
                                  onClick={() => handleDeleteTask(task.task_id)}
                                >
                                  <IconTrash size={12} />
                                </ActionIcon>
                              </Group>
                            )}
                          </Group>
                        </Paper>
                      ))
                    ) : (
                      <Paper p="md" withBorder radius="md" ta="center">
                        <ThemeIcon size="md" variant="light" color="green" mb="sm">
                          <IconCheck size={20} />
                        </ThemeIcon>
                        <Text fw={600} size="sm" c="green">All caught up!</Text>
                        <Text size="xs" c="dimmed">No tasks assigned.</Text>
                      </Paper>
                    )}
                  </Stack>
                </Card>
              </GridCol>

              {/* Dog Walking Log Section */}
              <GridCol span={{ base: 12, lg: 6 }}>
                <Card shadow="sm" padding="md" radius="md" withBorder>
                  <Group justify="space-between" align="center" mb="sm">
                    <Group gap="xs">
                      <ThemeIcon size="md" variant="light" color="green">
                        <IconDog size={16} />
                      </ThemeIcon>
                      <Text fw={600} size="sm">Dog Walking Log</Text>
                    </Group>
                  </Group>
                  
                  {/* Walk Form */}
                  <Paper p="md" withBorder mb="sm" radius="md" id="walk-form">
                    <form onSubmit={walkForm.onSubmit(handleSubmitWalk)}>
                      <Stack gap="sm">
                        <Select
                          label="Select Dog"
                          placeholder="Choose a dog"
                          data={dogs.map(dog => ({
                            value: dog.pet_id,
                            label: `${dog.name} (${dog.training_level})`
                          }))}
                          {...walkForm.getInputProps('dog_id')}
                          required
                          size="xs"
                        />
                        <Group grow>
                          <TextInput
                            label="Date"
                            type="date"
                            {...walkForm.getInputProps('walk_date')}
                            required
                            size="xs"
                          />
                          <TextInput
                            label="Time"
                            type="time"
                            {...walkForm.getInputProps('start_time')}
                            required
                            size="xs"
                          />
                        </Group>
                        <Group grow>
                          <Select
                            label="Duration"
                            data={[
                              { value: '15', label: '15 min' },
                              { value: '30', label: '30 min' },
                              { value: '45', label: '45 min' },
                              { value: '60', label: '1 hour' }
                            ]}
                            {...walkForm.getInputProps('duration')}
                            size="xs"
                          />
                        </Group>
                        <Textarea
                          label="Notes"
                          placeholder="Any observations..."
                          {...walkForm.getInputProps('notes')}
                          rows={2}
                          size="xs"
                        />
                        <Button type="submit" leftSection={<IconPlus size={14} />} size="xs">
                          Log Walk
                        </Button>
                      </Stack>
                    </form>
                  </Paper>

                  {/* Previous Walks */}
                  <Box>
                    <Text fw={600} size="sm" mb="sm">Recent Walks</Text>
                    <ScrollArea h={200}>
                      <Stack gap="sm">
                        {dogWalks.length > 0 ? (
                          dogWalks.map((walk) => (
                            <Paper key={walk.walk_id} p="sm" withBorder radius="md">
                              <Group justify="space-between" align="center">
                                <Group>
                                  <Avatar size="xs" color="green">
                                    <IconDog size={10} />
                                  </Avatar>
                                  <Box>
                                    <Text fw={500} size="xs">
                                      {walk.pets?.name || 'Unknown Dog'}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                      {new Date(walk.walk_date).toLocaleDateString()} at {walk.time_start}
                                    </Text>
                                  </Box>
                                </Group>
                                <Badge variant="light" color="green" size="xs">
                                  {walk.duration} min
                                </Badge>
                              </Group>
                              {walk.notes && (
                                <Text size="xs" c="dimmed" mt="xs" style={{ fontStyle: 'italic' }}>
                                  {walk.notes}
                                </Text>
                              )}
                            </Paper>
                          ))
                        ) : (
                          <Paper p="md" withBorder radius="md" ta="center">
                            <Text c="dimmed" size="xs">No walks logged yet today.</Text>
                          </Paper>
                        )}
                      </Stack>
                    </ScrollArea>
                  </Box>
                </Card>
              </GridCol>
            </Grid>

            {/* Messages Section */}
            <Card shadow="sm" padding="md" radius="md" withBorder mt="md">
              <Group justify="space-between" align="center" mb="sm">
                <Group gap="xs">
                  <ThemeIcon size="md" variant="light" color="blue">
                    <IconMessage size={16} />
                  </ThemeIcon>
                  <Text fw={600} size="sm">Messages & Announcements</Text>
                </Group>
                {currentUser?.role === 'manager' && (
                  <Button
                    leftSection={<IconPlus size={14} />}
                    onClick={() => setShowAddMessage(true)}
                    size="xs"
                  >
                    Post
                  </Button>
                )}
              </Group>
              <Stack gap="md">
                {messages.length > 0 ? (
                  messages.map((message) => (
                    <Paper key={message.message_id} p="md" withBorder radius="md">
                      <Group justify="space-between" align="flex-start" mb="sm">
                        <Box style={{ flex: 1 }}>
                          <Title order={5} mb="xs">{message.title}</Title>
                          <Text size="xs" c="dimmed" mb="xs">
                            Posted by {message.author_name} on {new Date(message.created_at).toLocaleDateString()}
                          </Text>
                          <Text size="sm">{message.content}</Text>
                        </Box>
                      </Group>
                      
                      {/* Comments */}
                      <Divider my="sm" />
                      <Box>
                        <Text fw={500} size="xs" mb="sm">Comments</Text>
                        <Stack gap="sm">
                          {(comments[message.message_id] || []).map((comment) => (
                            <Paper key={comment.comment_id} p="sm" withBorder radius="sm" style={{ marginLeft: '1rem' }}>
                              <Group gap="xs" mb="xs">
                                <Avatar size="xs" color="blue">
                                  {comment.author_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                </Avatar>
                                <Text size="xs" fw={500}>{comment.author_name}</Text>
                                <Text size="xs" c="dimmed">
                                  {new Date(comment.created_at).toLocaleDateString()}
                                </Text>
                              </Group>
                              <Text size="xs">{comment.content}</Text>
                            </Paper>
                          ))}
                          
                          {/* Add Comment Form */}
                          <form onSubmit={commentForm.onSubmit((values) => {
                            handleAddComment(message.message_id, values.content);
                          })}>
                            <Group gap="sm">
                              <TextInput
                                placeholder="Add a comment..."
                                style={{ flex: 1 }}
                                {...commentForm.getInputProps('content')}
                                size="xs"
                              />
                              <Button size="xs" type="submit">Comment</Button>
                            </Group>
                          </form>
                        </Stack>
                      </Box>
                    </Paper>
                  ))
                ) : (
                  <Paper p="md" withBorder radius="md" ta="center">
                    <ThemeIcon size="md" variant="light" color="blue" mb="sm">
                      <IconMessage size={20} />
                    </ThemeIcon>
                    <Text fw={600} size="sm" c="blue">No Messages</Text>
                    <Text size="xs" c="dimmed">No announcements have been posted yet.</Text>
                  </Paper>
                )}
              </Stack>
            </Card>
          </GridCol>
        </Grid>

        {/* Add Task Modal */}
        <Modal opened={showAddTask} onClose={() => setShowAddTask(false)} title="Add New Task" size="md">
          <form onSubmit={taskForm.onSubmit(handleAddTask)}>
            <Stack gap="md">
              <TextInput
                label="Task Title"
                placeholder="Enter task title"
                {...taskForm.getInputProps('title')}
                required
              />
              <Textarea
                label="Description"
                placeholder="Enter task description"
                {...taskForm.getInputProps('description')}
                rows={3}
              />
              <Select
                label="Priority"
                data={[
                  { value: '1', label: 'Critical' },
                  { value: '2', label: 'High' },
                  { value: '3', label: 'Medium' },
                  { value: '4', label: 'Low' },
                  { value: '5', label: 'Very Low' }
                ]}
                {...taskForm.getInputProps('priority')}
                required
              />
              <Textarea
                label="Notes (for volunteers)"
                placeholder="Add any notes or instructions"
                {...taskForm.getInputProps('notes')}
                rows={2}
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setShowAddTask(false)}>Cancel</Button>
                <Button type="submit">Create Task</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Edit Task Modal */}
        <Modal opened={!!editingTask} onClose={() => setEditingTask(null)} title="Edit Task" size="md">
          <form onSubmit={editTaskForm.onSubmit(handleUpdateTask)}>
            <Stack gap="md">
              <TextInput
                label="Task Title"
                placeholder="Enter task title"
                {...editTaskForm.getInputProps('title')}
                required
              />
              <Textarea
                label="Description"
                placeholder="Enter task description"
                {...editTaskForm.getInputProps('description')}
                rows={3}
              />
              <Select
                label="Priority"
                data={[
                  { value: '1', label: 'Critical' },
                  { value: '2', label: 'High' },
                  { value: '3', label: 'Medium' },
                  { value: '4', label: 'Low' },
                  { value: '5', label: 'Very Low' }
                ]}
                {...editTaskForm.getInputProps('priority')}
                required
              />
              <Textarea
                label="Notes (for volunteers)"
                placeholder="Add any notes or instructions"
                {...editTaskForm.getInputProps('notes')}
                rows={2}
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setEditingTask(null)}>Cancel</Button>
                <Button type="submit">Update Task</Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Add Message Modal */}
        <Modal opened={showAddMessage} onClose={() => setShowAddMessage(false)} title="Post Announcement" size="md">
          <form onSubmit={messageForm.onSubmit(handleAddMessage)}>
            <Stack gap="md">
              <TextInput
                label="Announcement Title"
                placeholder="Enter announcement title"
                {...messageForm.getInputProps('title')}
                required
              />
              <Textarea
                label="Content"
                placeholder="Enter announcement content"
                {...messageForm.getInputProps('content')}
                rows={6}
                required
              />
              <Group justify="flex-end">
                <Button variant="light" onClick={() => setShowAddMessage(false)}>Cancel</Button>
                <Button type="submit">Post Announcement</Button>
              </Group>
            </Stack>
          </form>
        </Modal>
      </Container>
    </Box>
  );
}
