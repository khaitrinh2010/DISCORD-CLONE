import {currentUser, auth} from "@clerk/nextjs/server";
import {db} from "@/lib/db";
export const initialSetupPage = async() => {
    const {userId, redirectToSignIn} = await auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const profile = await db.profile.findUnique({
        where: {
            userId: userId,
        },
    })
    if (profile) {
        return profile;
    }
    const user = await currentUser();

    // create a new profile
    const newProfile = await db.profile.create({
        data: {
            userId: userId,
            name: `${user.firstName}${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0]?.emailAddress,
        }
    });

    return newProfile;
}

