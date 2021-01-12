export interface NavigationItem {
  title: string;
  icon?: string;
  route?: string;
  children?: NavigationItem[];
}
