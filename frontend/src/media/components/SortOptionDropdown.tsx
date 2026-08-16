import Dropdown from "#/components/dropdown/Dropdown"
import type { MediaSortKey, MediaSortMode, MediaSortOrder } from "#/media/types/media"
import { faArrowDown, faArrowUp, faShuffle } from "@fortawesome/free-solid-svg-icons"

type SortOptionDropdownProps = {
    onClose?: () => void,
    sortMode: MediaSortMode,
    onSortByKey: (key: MediaSortKey) => void,
    onSort: (key: MediaSortKey, order: MediaSortOrder) => void,
    onShuffle: () => void
}

const sortOptions: { label: string; key: MediaSortKey }[] = [
    { label: "이름", key: "id" },
    { label: "수정 시간", key: "createdAt" },
    { label: "크기", key: "size" },
];


export default function SortOptionDropdown({ sortMode, onSortByKey, onSort, onShuffle }: SortOptionDropdownProps) {
    const toggleOrder = (order: MediaSortOrder): MediaSortOrder => order === "asc" ? "desc" : "asc";
    const getIcon = (key: MediaSortKey | "none") => {
        if (sortMode.type === "shuffle") {
            return (key === "none") ? faShuffle : undefined;
        }
        if (sortMode.key !== key)
            return undefined;
        return (sortMode.order === "asc" ? faArrowUp : faArrowDown);
    }

    const handleSort = (key: MediaSortKey) => {
        if (sortMode.type === "shuffle") {
            onSortByKey(key);
            return;
        }

        const order = sortMode.key === key
            ? toggleOrder(sortMode.order)
            : "asc";

        onSort(key, order);
    };

    return (
        <Dropdown>
            <Dropdown.HeaderItem label="정렬 기준" />
            {sortOptions.map(({ key, label }) => (
                <Dropdown.ButtonItem
                    key={key}
                    label={label}
                    icon={getIcon(key)}
                    onClick={() => handleSort(key)}
                />
            ))}
            <Dropdown.Separator />
            <Dropdown.ButtonItem label="무작위"
                icon={getIcon("none")}
                onClick={onShuffle}
            />
        </Dropdown>
    )
}