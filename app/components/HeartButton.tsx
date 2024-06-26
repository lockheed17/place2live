'use client';

import {SafeUser} from "../types";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import useFavorite from "@/app/hooks/useFavorite";

interface HeartButtonProps {
    listingId: string;
    currentUser?: SafeUser | null;
}

const HeartButton = ({listingId, currentUser}: HeartButtonProps) => {
    const {hasFavorited, toggleFavorite} = useFavorite({
        listingId,
        currentUser
    });

    return (
        <div
            onClick={toggleFavorite}
            className="
                relative
                hover:opacity-80
                transition
                cursor-pointer
            "
        >
            <AiOutlineHeart
                size={28}
                className="
                    fill-white
                    absolute
                    -top-[2px]
                    -right-[2px]
                "
            />
            <AiFillHeart
                size={28 - 4}
                className={
                    hasFavorited ? "fill-blue-400" : "fill-neutral-500/70"
                }
            />
        </div>
    );
}

export default HeartButton;