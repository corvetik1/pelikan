import type { AdminRole } from "@/types/admin";

export const roles: AdminRole[] = [
  {
    id: "r1",
    name: "Администратор",
    description: "Полный доступ ко всем разделам и операциям.",
    permissions: ["*"],
  },
  {
    id: "r2",
    name: "Редактор контента",
    description: "Может изменять новости, рецепты, магазины и товары.",
    permissions: [
      "news:create",
      "news:update",
      "news:delete",
      "recipes:*",
      "stores:*",
      "products:*",
    ],
  },
  {
    id: "r3",
    name: "Просмотр только",
    description: "Только просмотр данных без возможности изменения.",
    permissions: [],
  },
];

export default roles;
