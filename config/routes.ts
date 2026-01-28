export default [
    {
        path: '/user',
        layout: false,
        routes: [
            {
                path: '/user/login',
                layout: false,
                name: 'login',
                component: './user/Login',
            },
            {
                path: '/user',
                redirect: '/user/login',
            },
        ],
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: './TrangChu',
        icon: 'HomeOutlined',
    },
    // --- bài thực hành ---
    {
        path: '/bai-1',
        name: 'Bài 1: Đoán số',
        component: './baiTH1-B24CC209/bai1/doanSoRandom', 
        icon: 'QuestionCircleOutlined',
    },
    {
        path: '/bai-2',
        name: 'Bài 2: TodoList',
        component: './baiTH1-B24CC209/bai2/toDoList',  
        icon: 'UnorderedListOutlined',
    },
    // ------------------------------------
    {
        path: '/gioi-thieu',
        name: 'About',
        component: './TienIch/GioiThieu',
        hideInMenu: true,
    },
    {
        path: '/random-user',
        name: 'RandomUser',
        component: './RandomUser',
        icon: 'ArrowsAltOutlined',
    },
    {
        path: '/notification',
        routes: [
            { path: './subscribe', exact: true, component: './ThongBao/Subscribe' },
            { path: './check', exact: true, component: './ThongBao/Check' },
            { path: './', exact: true, component: './ThongBao/NotifOneSignal' },
        ],
        layout: false,
        hideInMenu: true,
    },
    { path: '/' },
    { path: '/403', component: './exception/403/403Page', layout: false },
    { path: '/hold-on', component: './exception/DangCapNhat', layout: false },
    { component: './exception/404' },
];