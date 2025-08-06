import { useEffect, useState } from "react";
import type { Route } from "./+types/announcements";
import {
  getMessages, getComments, createMessage, createComment, deleteComment
} from "~/lib/database";
import {
  Container, Title, Text, Card, Group, Button, Stack,
  TextInput, Textarea, Modal, LoadingOverlay, Alert,
  Box, Divider, Paper, Avatar, ActionIcon, useMantineTheme
} from '@mantine/core';
import {
  IconMessage, IconPlus, IconAlertCircle, IconTrash
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Announcements - Kenton County Animal Shelter" },
    { name: "description", content: "View and post announcements for volunteers." },
  ];
}

export default function Announcements() {
  const theme = useMantineTheme();

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

  // Individual comment states for each message
  const [commentStates, setCommentStates] = useState<{[key: string]: string}>({});

  // Helper function to get or set comment state for a specific message
  const getCommentState = (messageId: string) => {
    return commentStates[messageId] || '';
  };

  const setCommentState = (messageId: string, value: string) => {
    setCommentStates(prev => ({ ...prev, [messageId]: value }));
  };

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      if (!currentUser?.id) {
        setError('You must be logged in to view announcements');
        return;
      }
      
      const messagesData = await getMessages();
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

  // Message functions
  const handleAddMessage = async (values: any) => {
    try {
      if (!currentUser?.id) {
        notifications.show({
          title: 'Error',
          message: 'You must be logged in to post announcements',
          color: 'red'
        });
        return;
      }

      if (currentUser.role !== 'manager') {
        notifications.show({
          title: 'Error',
          message: 'Only managers can post announcements',
          color: 'red'
        });
        return;
      }

      const newMessage = await createMessage({
        content: `${values.title}\n\n${values.content}`,
        posted_by: currentUser.id
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
      if (!currentUser?.id) {
        notifications.show({
          title: 'Error',
          message: 'You must be logged in to add comments',
          color: 'red'
        });
        return;
      }

      const newComment = await createComment({
        message_id: messageId,
        content: content,
        posted_by: currentUser.id
      });
      setComments({
        ...comments,
        [messageId]: [...(comments[messageId] || []), newComment]
      });
      
      // Reset the specific comment state for this message
      setCommentState(messageId, '');
      
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

  const handleDeleteComment = async (messageId: string, commentId: string) => {
    try {
      await deleteComment(commentId);
      
      // Remove the comment from local state
      setComments(prevComments => ({
        ...prevComments,
        [messageId]: prevComments[messageId].filter(comment => comment.comment_id !== commentId)
      }));
      
      notifications.show({
        title: 'Success',
        message: 'Comment deleted successfully',
        color: 'green'
      });
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to delete comment',
        color: 'red'
      });
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
      <Container size="xl">
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group justify="space-between" align="center" mb="md">
            <Group gap="xs">
              <IconMessage size={24} color="var(--mantine-color-blue-6)" />
              <Title order={2} size="h3">Announcements</Title>
            </Group>
            {currentUser?.role === 'manager' && (
              <Button
                leftSection={<IconPlus size={16} />}
                onClick={() => setShowAddMessage(true)}
              >
                Post Announcement
              </Button>
            )}
          </Group>

          <Stack gap="md">
            {messages.length > 0 ? (
              messages.map((message) => (
                <Paper key={message.message_id} p="md" withBorder radius="md">
                  <Group justify="space-between" align="flex-start" mb="sm">
                                         <Box style={{ flex: 1 }}>
                       <Title order={4} mb="xs">
                         {message.content.split('\n')[0] || 'Announcement'}
                       </Title>
                       <Text size="sm" c="dimmed" mb="xs">
                         Posted by {message.users?.name || 'Unknown User'} on {new Date(message.timestamp).toLocaleDateString()}
                       </Text>
                       <Text size="md">
                         {message.content.split('\n').slice(1).join('\n') || message.content}
                       </Text>
                     </Box>
                  </Group>
                  
                  {/* Comments */}
                  <Divider my="sm" />
                  <Box>
                    <Text fw={500} size="sm" mb="sm">Comments</Text>
                    <Stack gap="sm">
                      {(comments[message.message_id] || []).map((comment) => (
                        <Paper key={comment.comment_id} p="sm" withBorder radius="sm" style={{ marginLeft: '1rem' }}>
                          <Group justify="space-between" align="flex-start">
                            <Box style={{ flex: 1 }}>
                              <Group gap="xs" mb="xs">
                                <Avatar size="sm" color="blue">
                                  {comment.users?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                                </Avatar>
                                <Text size="sm" fw={500}>{comment.users?.name || 'Unknown User'}</Text>
                                <Text size="xs" c="dimmed">
                                  {new Date(comment.timestamp).toLocaleDateString()}
                                </Text>
                              </Group>
                              <Text size="sm">{comment.content}</Text>
                            </Box>
                            {currentUser?.id === comment.posted_by && (
                              <ActionIcon
                                size="xs"
                                variant="light"
                                color="red"
                                onClick={() => handleDeleteComment(message.message_id, comment.comment_id)}
                              >
                                <IconTrash size={12} />
                              </ActionIcon>
                            )}
                          </Group>
                        </Paper>
                      ))}
                      
                      {/* Add Comment Form */}
                      {currentUser?.id ? (
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const content = getCommentState(message.message_id);
                          if (content.trim()) {
                            handleAddComment(message.message_id, content);
                          }
                        }}>
                          <Group gap="sm">
                            <TextInput
                              placeholder={`Add a comment as ${currentUser.name}...`}
                              style={{ flex: 1 }}
                              value={getCommentState(message.message_id)}
                              onChange={(e) => setCommentState(message.message_id, e.target.value)}
                            />
                            <Button size="sm" type="submit">Comment</Button>
                          </Group>
                        </form>
                      ) : (
                        <Text size="sm" c="dimmed" ta="center" py="sm">
                          Please log in to add comments
                        </Text>
                      )}
                    </Stack>
                  </Box>
                </Paper>
              ))
            ) : (
              <Paper p="xl" withBorder radius="md" ta="center">
                <IconMessage size={48} color="var(--mantine-color-blue-3)" />
                <Title order={3} size="h4" c="blue" mb="sm">No Announcements</Title>
                <Text size="md" c="dimmed" mb="lg">
                  No announcements have been posted yet.
                </Text>
                {currentUser?.role === 'manager' && (
                  <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={() => setShowAddMessage(true)}
                  >
                    Post First Announcement
                  </Button>
                )}
              </Paper>
            )}
          </Stack>
        </Card>

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