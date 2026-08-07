import Dropdown from "#/components/dropdown/Dropdown"
import type { MediaSortKey, MediaSortMode, MediaSortOrder } from "#/media/types/media"
import { faCheck } from "@fortawesome/free-solid-svg-icons"

type SortOptionDropdownProps = {
    onClose?: () => void,
    sortOption: MediaSortMode,
    onSortByKey: (key: MediaSortKey) => void,
    onSortByOrder: (order: MediaSortOrder) => void,
}

export default function SortOptionDropdown({ onClose, sortOption, onSortByKey, onSortByOrder }: SortOptionDropdownProps) {
    return (
        <Dropdown onClose={onClose}>
            <Dropdown.HeaderItem label="정렬 기준" />
            <Dropdown.ButtonItem label="이름"
                icon={faCheck}
                iconVisible={sortOption.type === "sort" && sortOption.key === "id"}
                onClick={() => onSortByKey("id")}
            />
            <Dropdown.ButtonItem label="수정 시간"
                icon={faCheck}
                iconVisible={sortOption.type === "sort" && sortOption.key === "createdAt"}
                onClick={() => onSortByKey("createdAt")}
            />
            <Dropdown.ButtonItem label="크기"
                icon={faCheck}
                iconVisible={sortOption.type === "sort" && sortOption.key === "size"}
                onClick={() => onSortByKey("size")}
            />
            <Dropdown.Separator />
            <Dropdown.HeaderItem label="정렬 순서" />
            <Dropdown.ButtonItem label="오름차순"
                icon={faCheck}
                iconVisible={sortOption.type === "sort" && sortOption.order === "asc"}
                onClick={() => onSortByOrder("asc")}
            />
            <Dropdown.ButtonItem label="내림차순"
                icon={faCheck}
                iconVisible={sortOption.type === "sort" && sortOption.order === "desc"}
                onClick={() => onSortByOrder("desc")}
            />
        </Dropdown>
    )
}