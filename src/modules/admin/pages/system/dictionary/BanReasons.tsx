import PunishmentDictsBase from "./PunishmentDictsBase";
import { ListPunishmentDictDto } from "@/api/models/ListPunishmentDictDto";

export default function BanReasons() {
  return (
    <PunishmentDictsBase category={ListPunishmentDictDto.category.BAN_REASON} title="封禁原因" />
  );
}
