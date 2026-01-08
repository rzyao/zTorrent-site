import PunishmentDictsBase from "./PunishmentDictsBase";
import { ListPunishmentDictDto } from "@/api/models/ListPunishmentDictDto";

export default function BanDays() {
  return (
    <PunishmentDictsBase category={ListPunishmentDictDto.category.BAN_DAYS} title="封禁时长" />
  );
}
