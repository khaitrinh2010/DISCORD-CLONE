import {AvatarImage, Avatar} from "@/components/ui/avatar";
import {cn} from "@/lib/utils";

interface UserAvatarProps {
    src?: string;
    className?: string;
}

const UserAvatar = ({src, className} : UserAvatarProps) => {
    return (
        <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
            <AvatarImage src={src}  />
        </Avatar>
    )
}
export default UserAvatar;
