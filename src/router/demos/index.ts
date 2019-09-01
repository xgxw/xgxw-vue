import { RouteConfig } from 'vue-router';
import Catalog from '@/views/demo/CatalogMenu.vue';

export const catalogPath = "/demo/catalog"
export const catalog: RouteConfig = {
    path: catalogPath,
    name: 'demo_catalog',
    component: Catalog,
    meta: {
        title: '示例-目录',
    },
};

export const demos: RouteConfig[] = [catalog]