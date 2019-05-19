import Vue from 'vue';
import VueRouter from 'vue-router';
import state from './main/state'

Vue.use(VueRouter);


import mangerHome from './components/managerHome.vue';
import mangerLogin from './components/mangerLogin.vue';

import addBook from './views/addBook.vue';
import addGenre from './views/addGenre.vue';
import addBookshelf from './views/addBookshelf.vue';
import addBookInstance from './views/addBookInstance.vue';
import bookList from './views/bookList.vue';
import bookInstanceList from './views/bookInstanceList.vue';
import bookshelfList from './views/bookshelfList.vue';
import borrowList from './views/borrowList.vue';
import genreList from './views/genreList.vue';
import userList from './views/userList.vue';
import manage from './views/manage.vue';
import home from './views/home.vue';

import userhome from './userviews/userhome.vue';
import userLayout from './userviews/userLayout.vue';
import userBookshelf from './userviews/userBookshelf.vue';
import userLogin from './userviews/login.vue';
import forgetPassword from './userviews/forgetPassword.vue';
import search from './userviews/search.vue';
import bookDetail from './userviews/bookDetail.vue'
import userview from './userviews/userview.vue'

const routes = [
    {
        path: '/', name: 'userhome', component: userLayout,
        children: [{
            path: '/',
            name: 'userindex',
            component: userhome,
            meta: [],
        },
        {
            path: '/home/userBookshelf',
            component: userBookshelf,
            meta: [],
        },
        {
            path: '/home/login',
            component: userLogin,
            meta: [],
        },
        {
            path: '/home/forgetPassword',
            component: forgetPassword,
            meta: [],
        },
        {
            path: '/home/userview',
            component: userview,
            meta: [],
        },
        {
            path: '/book/:bookId',
            name: 'bookDetail',
            component: bookDetail,
            meta: [],
            props: true
        },
        {
            path: '/search/:keyword',
            name: 'search',
            component: search,
            meta: [],
            props: true
        },
        ]
    },
    { path: '/managerlogin', name: 'managerlogin', component: mangerLogin },
    {
        path: '/manager',
        name: '',
        component: manage,
        meta: { manager: true },
        children: [{
            path: '',
            component: home,
            meta: [],
        }, {
            path: '/addBook',
            component: addBook,
            meta: ['书籍管理', '添加书本'],
        }, {
            path: '/addGenre',
            component: addGenre,
            meta: ['种类管理', '添加种类'],
        }, {
            path: '/addBookshelf',
            component: addBookshelf,
            meta: ['书架管理', '添加书架'],
        }, {
            path: '/bookList',
            component: bookList,
            meta: ['书籍管理', '书本列表'],
        }, {
            path: '/bookInstanceList',
            component: bookInstanceList,
            meta: ['书籍管理', '书本实例列表'],
        }, {
            path: '/addBookInstance',
            component: addBookInstance,
            meta: ['书籍管理', '添加书本实例'],
        }, {
            path: '/bookshelfList',
            component: bookshelfList,
            meta: ['书架管理', '书架列表'],
        }, {
            path: '/borrowList',
            component: borrowList,
            meta: ['书籍管理', '借阅列表'],
        }, {
            path: '/genreList',
            component: genreList,
            meta: ['种类管理', '种类列表'],
        }, {
            path: '/userList',
            component: userList,
            meta: ['用户管理', '用户列表'],
        },]
    },

]

const router = new VueRouter({
    routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        if (to.hash) {
            return { selector: to.hash }
        }
        return { x: 0, y: 0 }
    },
})

router.beforeEach((to, from, next) => {
    console.log('to', to.name, to.meta, to.fullPath);
    // if (to.meta.private && !state.user) {
    if (to.matched.some(r => r.meta.manager) && !state.manager) {
        next({ name: 'managerlogin', params: { wantedRoute: to.fullPath } });
        return;
    }
    if (to.matched.some(r => r.meta.private) && !state.user) {
        next({ name: 'login', params: { wantedRoute: to.fullPath } });
        return;
    }
    if (to.matched.some(r => r.meta.guest) && state.user) {
        next({ name: 'home' });
        return;
    }
    next();
})

export default router;