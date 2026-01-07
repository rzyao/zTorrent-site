import PunishmentDictsBase from "./PunishmentDictsBase";
import { ListPunishmentDictDto } from "@/api/models/ListPunishmentDictDto";

export default function PunishmentTypes() {
  return (
    <PunishmentDictsBase
      category={ListPunishmentDictDto.category.PUNISHMENT_TYPE}
      title="处罚类型"
    />
  );
}
