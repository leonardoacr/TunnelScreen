import { nameByRace } from "fantasy-name-generator";
export const getRandomUsername = () => {
    const fairyHero = nameByRace("fairy", { gender: "male" });
    return fairyHero;
}