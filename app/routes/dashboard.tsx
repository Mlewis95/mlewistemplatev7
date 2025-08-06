import { useEffect, useState } from "react";
import type { Route } from "./+types/dashboard";
import {
  getTasks, getDogsForWalking, getDogWalks, createDogWalk,
  getMessages, getComments, createMessage, createComment,
  updateTask, deleteTask, createTask
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

  // Mock current user (in real app, this would come from auth)
  const currentUser = {
    user_id: '550e8400-e29b-41d4-a716-446655440001', // Morgan Lewis (manager)
    name: 'Morgan Lewis',
    role: 'manager' as 'volunteer' | 'manager',
    profile_photo_url: null as string | null,
    total_hours: 45.5
  };

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
      const [tasksData, dogsData, walksData, messagesData] = await Promise.all([
        getTasks(),
        getDogsForWalking(),
        getDogWalks(currentUser.user_id),
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
        created_by: currentUser.user_id
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
        user_id: currentUser.user_id,
        dog_id: values.dog_id,
        walk_date: values.walk_date,
        time_start: values.start_time,
        duration: values.duration
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
        posted_by: currentUser.user_id
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
        posted_by: currentUser.user_id
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
        <Stack gap="xl">
          {/* Header with Welcome Stats */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="center">
              <Group>
                <Avatar size="lg" src={currentUser.profile_photo_url} color="orange">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Title order={2} c="dark.8">Welcome back, {currentUser.name}!</Title>
                  <Text c="dimmed" size="sm">Ready to make a difference today?</Text>
                </Box>
              </Group>
              <Group>
                <RingProgress
                  size={80}
                  thickness={8}
                  sections={[{ value: 75, color: 'orange' }]}
                  label={
                    <Text ta="center" size="xs" fw={700}>
                      {currentUser.total_hours}h
                    </Text>
                  }
                />
                <Box>
                  <Text size="xs" c="dimmed">Total Hours</Text>
                  <Text fw={700} size="lg">{currentUser.total_hours}</Text>
                </Box>
              </Group>
            </Group>
          </Card>

          {/* Quick Actions */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">Quick Actions</Title>
            <Group>
              <Button
                leftSection={<IconPlus size={16} />}
                variant="gradient"
                gradient={{ from: 'orange', to: 'red' }}
                onClick={() => setShowAddTask(true)}
                disabled={currentUser.role !== 'manager'}
              >
                Add Task
              </Button>
              <Button
                leftSection={<IconMessage size={16} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                onClick={() => setShowAddMessage(true)}
                disabled={currentUser.role !== 'manager'}
              >
                Post Announcement
              </Button>
              <Button
                leftSection={<IconDog size={16} />}
                variant="gradient"
                gradient={{ from: 'green', to: 'teal' }}
                onClick={() => document.getElementById('walk-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Log Dog Walk
              </Button>
            </Group>
          </Card>

          {/* Main Content Grid */}
          <Grid gutter="lg">
            {/* Daily Tasks Section */}
            <GridCol span={{ base: 12, lg: 6 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" align="center" mb="md">
                  <Group>
                    <ThemeIcon size="lg" variant="light" color="orange">
                      <IconList size={20} />
                    </ThemeIcon>
                    <Title order={3}>Daily Tasks</Title>
                  </Group>
                  {currentUser.role === 'manager' && (
                    <Button
                      size="sm"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => setShowAddTask(true)}
                    >
                      Add Task
                    </Button>
                  )}
                </Group>
                <Stack gap="md">
                  {tasks.length > 0 ? (
                    tasks.map((task) => (
                      <Paper key={task.task_id} p="md" withBorder radius="md">
                        <Group justify="space-between" align="flex-start">
                          <Box style={{ flex: 1 }}>
                            <Group gap="xs" mb="xs">
                              <Text fw={600}>{task.title}</Text>
                              <Badge color={getPriorityColor(task.priority)} variant="light">
                                {getPriorityLabel(task.priority)}
                              </Badge>
                            </Group>
                            {task.description && (
                              <Text size="sm" c="dimmed" mb="xs">
                                {task.description}
                              </Text>
                            )}
                            {task.notes && (
                              <Text size="sm" c="blue" style={{ fontStyle: 'italic' }}>
                                Note: {task.notes}
                              </Text>
                            )}
                          </Box>
                          {currentUser.role === 'manager' && (
                            <Group gap="xs">
                              <ActionIcon
                                size="sm"
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
                                <IconEdit size={14} />
                              </ActionIcon>
                              <ActionIcon
                                size="sm"
                                variant="light"
                                color="red"
                                onClick={() => handleDeleteTask(task.task_id)}
                              >
                                <IconTrash size={14} />
                              </ActionIcon>
                            </Group>
                          )}
                        </Group>
                      </Paper>
                    ))
                  ) : (
                    <Paper p="xl" withBorder radius="md" ta="center">
                      <ThemeIcon size="xl" variant="light" color="green" mb="md">
                        <IconCheck size={32} />
                      </ThemeIcon>
                      <Title order={4} c="green">All caught up!</Title>
                      <Text c="dimmed">No tasks assigned at the moment.</Text>
                    </Paper>
                  )}
                </Stack>
              </Card>
            </GridCol>

            {/* Dog Walking Log Section */}
            <GridCol span={{ base: 12, lg: 6 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="md">
                  <ThemeIcon size="lg" variant="light" color="green">
                    <IconDog size={20} />
                  </ThemeIcon>
                  <Title order={3}>Dog Walking Log</Title>
                </Group>
                
                {/* Walk Form */}
                <Paper p="xl" withBorder mb="lg" radius="md" id="walk-form">
                  <form onSubmit={walkForm.onSubmit(handleSubmitWalk)}>
                    <Stack gap="md">
                      <Select
                        label="Select Dog"
                        placeholder="Choose a dog to walk"
                        data={dogs.map(dog => ({
                          value: dog.pet_id,
                          label: `${dog.name} (${dog.training_level})`
                        }))}
                        {...walkForm.getInputProps('dog_id')}
                        required
                      />
                      <Group grow>
                        <TextInput
                          label="Date"
                          type="date"
                          {...walkForm.getInputProps('walk_date')}
                          required
                        />
                        <TextInput
                          label="Start Time"
                          type="time"
                          {...walkForm.getInputProps('start_time')}
                          required
                        />
                      </Group>
                      <Group grow>
                        <Select
                          label="Duration (minutes)"
                          data={[
                            { value: '15', label: '15 minutes' },
                            { value: '30', label: '30 minutes' },
                            { value: '45', label: '45 minutes' },
                            { value: '60', label: '1 hour' }
                          ]}
                          {...walkForm.getInputProps('duration')}
                        />
                      </Group>
                      <Textarea
                        label="Notes (optional)"
                        placeholder="Any observations or notes about the walk..."
                        {...walkForm.getInputProps('notes')}
                        rows={3}
                      />
                      <Button type="submit" leftSection={<IconPlus size={16} />}>
                        Log Walk
                      </Button>
                    </Stack>
                  </form>
                </Paper>

                {/* Previous Walks */}
                <Box>
                  <Title order={4} mb="md">Recent Walks</Title>
                  <ScrollArea h={300}>
                    <Stack gap="sm">
                      {dogWalks.length > 0 ? (
                        dogWalks.map((walk) => (
                          <Paper key={walk.walk_id} p="md" withBorder radius="md">
                            <Group justify="space-between" align="center">
                              <Group>
                                <Avatar size="sm" color="green">
                                  <IconDog size={14} />
                                </Avatar>
                                <Box>
                                  <Text fw={500} size="sm">
                                    {dogs.find(d => d.pet_id === walk.pet_id)?.name || 'Unknown Dog'}
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    {new Date(walk.walk_date).toLocaleDateString()} at {walk.start_time}
                                  </Text>
                                </Box>
                              </Group>
                              <Badge variant="light" color="green">
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
                        <Paper p="xl" withBorder radius="md" ta="center">
                          <Text c="dimmed">No walks logged yet today.</Text>
                        </Paper>
                      )}
                    </Stack>
                  </ScrollArea>
                </Box>
              </Card>
            </GridCol>
          </Grid>

          {/* Messages Section */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" align="center" mb="md">
              <Group>
                <ThemeIcon size="lg" variant="light" color="blue">
                  <IconMessage size={20} />
                </ThemeIcon>
                <Title order={3}>Messages & Announcements</Title>
              </Group>
              {currentUser.role === 'manager' && (
                <Button
                  leftSection={<IconPlus size={16} />}
                  onClick={() => setShowAddMessage(true)}
                >
                  Post Announcement
                </Button>
              )}
            </Group>
            <Stack gap="lg">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <Paper key={message.message_id} p="lg" withBorder radius="md">
                    <Group justify="space-between" align="flex-start" mb="md">
                      <Box style={{ flex: 1 }}>
                        <Title order={4} mb="xs">{message.title}</Title>
                        <Text size="sm" c="dimmed" mb="xs">
                          Posted by {message.author_name} on {new Date(message.created_at).toLocaleDateString()}
                        </Text>
                        <Text>{message.content}</Text>
                      </Box>
                    </Group>
                    
                    {/* Comments */}
                    <Divider my="md" />
                    <Box>
                      <Text fw={500} size="sm" mb="sm">Comments</Text>
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
                            <Text size="sm">{comment.content}</Text>
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
                            />
                            <Button size="sm" type="submit">Comment</Button>
                          </Group>
                        </form>
                      </Stack>
                    </Box>
                  </Paper>
                ))
              ) : (
                <Paper p="xl" withBorder radius="md" ta="center">
                  <ThemeIcon size="xl" variant="light" color="blue" mb="md">
                    <IconMessage size={32} />
                  </ThemeIcon>
                  <Title order={4} c="blue">No Messages</Title>
                  <Text c="dimmed">No announcements have been posted yet.</Text>
                </Paper>
              )}
            </Stack>
          </Card>
        </Stack>

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
