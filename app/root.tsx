import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { MantineProvider, createTheme, AppShell, Burger, Group, Title, Text, Box } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useDisclosure } from '@mantine/hooks';
import { NavLink } from 'react-router';
import { IconDashboard, IconDog, IconHome, IconChevronRight } from '@tabler/icons-react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import type { Route } from "./+types/root";
import "./app.css";

const theme = createTheme({
  primaryColor: 'orange',
  fontFamily: 'Inter, sans-serif',
  colors: {
    'background': ['#FFF9F5', '#FFF4EA', '#FFEEDD', '#FFE8D1', '#FFE2C4', '#FFDDB8', '#FFD8AC', '#FFD3A0', '#FFCE94', '#FFC988'],
    'accent-blue': ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5', '#2196F3', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1'],
    'accent-green': ['#E8F5E9', '#C8E6C9', '#A5D6A7', '#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32', '#1B5E20'],
    'accent-purple': ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C'],
  },
  components: {
    Card: {
      defaultProps: { bg: 'background.1' }
    },
    Paper: {
      defaultProps: { bg: 'white' }
    }
  }
});

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppShellDemo() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: IconDashboard, to: '/' },
    { label: 'Pets', icon: IconDog, to: '/pets' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      style={{ backgroundColor: 'var(--mantine-color-background-0)' }}
    >
      <AppShell.Header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Box>
              <Title order={3} c="orange.6">Kenton County Animal Shelter</Title>
              <Text size="xs" c="dimmed">Volunteer Management System</Text>
            </Box>
          </Group>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Text size="sm" c="dimmed">Welcome, Morgan Lewis</Text>
          </Box>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" style={{ backgroundColor: 'white', borderRight: '1px solid var(--mantine-color-gray-3)' }}>
        <AppShell.Section>
          <Title order={4} mb="lg" c="dark.8">Navigation</Title>
        </AppShell.Section>
        
        <AppShell.Section grow>
          <Box>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <Box
                    p="md"
                    mb="xs"
                    style={{
                      borderRadius: '8px',
                      backgroundColor: isActive ? 'var(--mantine-color-orange-1)' : 'transparent',
                      border: isActive ? '1px solid var(--mantine-color-orange-3)' : '1px solid transparent',
                      color: isActive ? 'var(--mantine-color-orange-7)' : 'inherit',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'var(--mantine-color-gray-1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Group>
                      <Icon size={20} />
                      <Text fw={isActive ? 600 : 400}>{item.label}</Text>
                    </Group>
                  </Box>
                </NavLink>
              );
            })}
          </Box>
        </AppShell.Section>

        <AppShell.Section>
          <Box p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
            <Text size="sm" c="dimmed" ta="center">
              © 2024 Kenton County Animal Shelter
            </Text>
          </Box>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box p="md">
          {/* Breadcrumb */}
          <Group gap="xs" mb="md" style={{ opacity: 0.7 }}>
            <Text size="sm" c="dimmed">Home</Text>
            <IconChevronRight size={14} />
            <Text size="sm" fw={500}>
              {location.pathname === '/' ? 'Dashboard' : 
               location.pathname === '/pets' ? 'Pets' : 'Page'}
            </Text>
          </Group>
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <AppShellDemo />
    </MantineProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
