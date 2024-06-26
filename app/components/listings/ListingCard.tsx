'use client';

import {SafeListing, SafeReservation, SafeUser} from "@/app/types";
import {useRouter} from "next/navigation";
import useCountries from "@/app/hooks/useCountries";
import {useCallback, useMemo} from "react";
import {format} from "date-fns";
import { uk } from "date-fns/locale";
import Button from "@/app/components/Button";
import Image from "next/image"
import HeartButton from "@/app/components/HeartButton";
import {categories} from "@/app/components/navbar/Categories";

interface ListingCardProps {
    data: SafeListing,
    reservation?: SafeReservation,
    onAction?: (id: string) => void,
    disabled?: boolean
    actionLabel?: string,
    actionId?: string,
    currentUser?: SafeUser | null,
    secondaryActionLabel?: string,
    onSecondaryAction?: (data: SafeListing) => void,
}

const ListingCard = ({data, reservation, onAction, disabled, actionLabel, actionId = '', currentUser, onSecondaryAction, secondaryActionLabel}: ListingCardProps) => {
    const router = useRouter();
    const {getByValue} = useCountries();

    const location = getByValue(data.locationValue);

    const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()

        if (disabled) {
            return;
        }

        onAction?.(actionId);
    }, [onAction, actionId, disabled]);

    const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()

        if (disabled) {
            return;
        }

        onSecondaryAction?.(data)
    }, [onSecondaryAction, data.id, disabled]);

    const price = useMemo(() => {
        if (reservation) {
            return reservation.totalPrice;
        }
        return data.price
    }, [reservation, data.price]);

    const reservationDate = useMemo(() => {
        if(!reservation) return null

        const start = new Date(reservation.startDate)
        const end = new Date(reservation.endDate)

        return `${format(start, 'PP', { locale: uk })} - ${format(end, 'PP', { locale: uk })}`
    }, [reservation]);

    const categoryLabel = useMemo(() => {
        const currentCategory = categories.find((category) => category.label === data.category);

        if (currentCategory) {
            return currentCategory.labelUk;
        } else {
            return data.category;
        }

    }, [data.category]);

    return (
        <div
            onClick={() => router.push(`/listings/${data.id}`)}
            className="
                col-span-1 cursor-pointer group
            "
        >
            <div className="flex flex-col gap-2 w-full h-full">
                <div
                    className="
                        aspect-square
                        w-full
                        relative
                        overflow-hidden
                        rounded-xl
                    "
                >
                    <Image
                        fill
                        alt="Оголошення"
                        src={data.imageSrc}
                        className="
                            object-cover
                            h-full
                            w-full
                            group-hover:scale-110
                            transition
                        "
                    />
                    <div className="absolute top-3 right-3">
                        <HeartButton
                            listingId={data.id}
                            currentUser={currentUser}
                        />
                    </div>
                </div>
                <div className="font-semibold text-lg">
                    {location?.region}, {location?.label}
                </div>
                <div className="font-light text-neutral-500 flex-grow">
                    {reservationDate || categoryLabel}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <div className="font-semibold">
                        $ {price}
                    </div>
                    {!reservation && (
                        <div className="font-light">
                            ніч
                        </div>
                    )}
                </div>
                {onAction && actionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={actionLabel}
                        onClick={handleCancel}
                    />
                )}
                {onSecondaryAction && secondaryActionLabel && (
                    <Button
                        disabled={disabled}
                        small
                        label={secondaryActionLabel}
                        onClick={handleEdit}
                    />
                )}
            </div>
        </div>
    );
}

export default ListingCard;