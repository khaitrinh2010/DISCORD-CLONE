import {NavigationSidebar} from "@/components/navigation/navigation-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen flex">
            {/* Server Sidebar */}
            <div className="w-[72px] bg-gray-900 flex-shrink-0">
                <NavigationSidebar />
            </div>

            {/* Main area */}
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default MainLayout;

