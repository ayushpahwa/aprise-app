import { GroupType } from "api/GroupsAPI";
import {
  GROUP_DESC_HOME,
  GROUP_DESC_PERSONAL,
  GROUP_DESC_TRAVEL,
  createMessage,
} from "constants/messages";

export const iconForGroupType = (groupType: GroupType) => {
  switch (groupType.toLowerCase()) {
    case GroupType.PERSONAL.toLowerCase():
      return "account-outline";
    case GroupType.HOME.toLowerCase():
      return "home-outline";
    case GroupType.TRAVEL.toLowerCase():
      return "airballoon-outline";
    default:
      return "account-group";
  }
};

export const generateSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const getGroupDescription = (
  description: string,
  groupType: GroupType,
) => {
  if (!!description && description.length > 0) {
    return description;
  }
  switch (groupType.toLowerCase()) {
    case GroupType.PERSONAL.toLowerCase():
      return createMessage(GROUP_DESC_PERSONAL);
    case GroupType.HOME.toLowerCase():
      return createMessage(GROUP_DESC_HOME);
    case GroupType.TRAVEL.toLowerCase():
      return createMessage(GROUP_DESC_TRAVEL);
    default:
      return "Group";
  }
};

export const getDefaultGroupNames = (groupType: GroupType) => {
  switch (groupType.toLowerCase()) {
    case GroupType.PERSONAL.toLowerCase():
      return "Personal expenses";
    case GroupType.HOME.toLowerCase():
      return "My home";
    case GroupType.TRAVEL.toLowerCase():
      return "Vacation records";
    default:
      return "Group";
  }
};
