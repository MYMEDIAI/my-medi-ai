import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { Home, Plus, ListChecks, Shield } from "lucide-react"

interface NavItem {
  name: string
  href: string
  icon: LucideIcon
  description: string
  badge?: string
  color?: string
}

const navigationItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
    description: "Your personal dashboard",
  },
  {
    name: "Create Assessment",
    href: "/create-assessment",
    icon: Plus,
    description: "Create a new assessment",
  },
  {
    name: "Assessments",
    href: "/assessments",
    icon: ListChecks,
    description: "View all assessments",
  },
  {
    name: "AI Safety",
    href: "/safe-ai-assessment",
    icon: Shield,
    description: "Safe AI health assessment with built-in safety measures",
    badge: "Safe",
    color: "text-red-600",
  },
]

const EnhancedNavigation = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navigationItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuTrigger>
              <item.icon className="mr-2 h-4 w-4" />
              {item.name}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink href={item.href}>
                <div className="font-medium">{item.name}</div>
                <p className="text-sm mt-1">{item.description}</p>
                {item.badge && (
                  <div className={cn("rounded-full px-2 py-1 text-xs font-bold uppercase", item.color)}>
                    {item.badge}
                  </div>
                )}
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default EnhancedNavigation
