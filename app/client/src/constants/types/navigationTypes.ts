import { NavigationProp } from '@react-navigation/native';
import { Group } from 'api/GroupsAPI';

export enum ScreenNamesEnum {
  // Root stack screens
  ROOT_AUTH = 'Auth',
  ROOT_TABS = 'Tabs',
  ROOT_MANAGE_GROUPS = 'ManageGroups',
  ROOT_GROUP_DETAILS = 'GroupDetails',
  // Tabs stack screens
  TABS_HOME = 'Home',
  TABS_GROUPS = 'Groups',
  TABS_PROFILE = 'Profile',
  TABS_ACTIVITIES = 'Activities',
  TABS_ADD = 'Add',
}

// Root stack navigation types
export type RootStackParamList = {
  [ScreenNamesEnum.ROOT_AUTH]: undefined;
  [ScreenNamesEnum.ROOT_TABS]: undefined;
  [ScreenNamesEnum.ROOT_MANAGE_GROUPS]: Partial<Group>;
  [ScreenNamesEnum.ROOT_GROUP_DETAILS]: { groupId: number };
};
export type RootStackNavigationType = NavigationProp<RootStackParamList>;

// Tabs stack navigation types
export type TabsStackParamList = {
  [ScreenNamesEnum.TABS_HOME]: undefined;
  [ScreenNamesEnum.TABS_GROUPS]: undefined;
  [ScreenNamesEnum.TABS_PROFILE]: undefined;
  [ScreenNamesEnum.TABS_ACTIVITIES]: undefined;
  [ScreenNamesEnum.TABS_ADD]: undefined;
};
export type TabsStackNavigationType = NavigationProp<TabsStackParamList>;
