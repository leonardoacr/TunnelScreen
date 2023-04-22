import { nameByRace } from "fantasy-name-generator";

export const getRandomUsername = async (): Promise<string> => {
    const fairyHero: string | Error = nameByRace("fairy", { gender: "male" });

    if (typeof fairyHero === "string") {
        return fairyHero;
    } else {
        const errorMessage = "Error generating random name.";
        throw new Error(errorMessage);
    }
};
