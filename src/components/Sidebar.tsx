import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import {
  BookOpenIcon,
  HomeIcon,
  UserIcon,
  FileTextIcon,
  BarChart3Icon,
  ChevronRightIcon,
  CompassIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const items = [
  { title: 'Home', href: '/', icon: <HomeIcon /> },
  { title: 'Library', href: '/library', icon: <BookOpenIcon /> },
  { title: 'Explore topics', href: '/topics', icon: <CompassIcon /> },
  { title: 'My Blogs', href: '/me/stories', icon: <FileTextIcon /> },
  { title: 'Profile', href: '/me/profile', icon: <UserIcon /> },
]

const AppSidebar = () => {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4"></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={`cursor-pointer ${
                  pathname === item.href ? 'bg-sidebar-accent text-black' : ''
                }`}
              >
                <SidebarMenuButton asChild size="lg">
                  <Link href={item.href} className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-2">
            <Link href="/me/following-feed">
              <span className="font-medium hover:cursor-pointer hover:underline">
                Following
              </span>
            </Link>
            <ChevronRightIcon className="size-4" />
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-2 py-3" />
    </Sidebar>
  )
}

export default AppSidebar
