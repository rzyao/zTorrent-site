import PunishmentDictsBase from "./PunishmentDictsBase";
import { ListPunishmentDictDto } from "@/api/models/ListPunishmentDictDto";

export default function UnbanReasons() {
  return (
    <PunishmentDictsBase category={ListPunishmentDictDto.category.UNBAN_REASON} title="解封原因" />
  );
}
