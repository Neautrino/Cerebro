import { Brain, Search } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import { Input } from "../ui/input"
import UserBtn from "./UserBtn"

function Navbar() {
  return (
    <div className="border-b-2">
        <div className="flex h-16 items-center px-4">
            <div className="flex items-center space-x-4">
                <Brain className="h-6 w-6" />
                <h2 className="text-lg font-semibold">Cerebro</h2>
            </div>
            <div className="ml-auto flex items-center space-x-4">
                <div className="relative w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8" />
                </div>
                <ThemeToggle  />
                <UserBtn />
            </div>
        </div>
    </div>
  )
}

export default Navbar