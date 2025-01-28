import { Brain } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import UserBtn from "./UserBtn"
import { OrganizationSwitcher } from "@clerk/nextjs"

function Navbar() {
  return (
    <div className="border-b-2">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Brain className="h-6 w-6" />
          <h2 className="text-lg font-semibold">Cerebro</h2>
        </div>
        <div className="ml-auto flex items-center space-x-6">
          {/* <OrganizationSwitcher
            afterCreateOrganizationUrl="/home"
            afterLeaveOrganizationUrl="/home"
            afterSelectOrganizationUrl="/home"
            afterSelectPersonalUrl="/home"
          /> */}
          <ThemeToggle />
          <UserBtn />
        </div>
      </div>
    </div>
  )
}

export default Navbar