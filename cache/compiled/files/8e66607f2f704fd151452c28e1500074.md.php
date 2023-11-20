<?php
return [
    '@class' => 'Grav\\Common\\File\\CompiledMarkdownFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/pages/04.home/blog_list.md',
    'modified' => 1698999508,
    'size' => 230,
    'data' => [
        'storage_key' => '',
        'header' => [
            'title' => 'Home',
            'content' => [
                'items' => [
                    0 => '@self.children'
                ],
                'leading' => 0,
                'columns' => 2,
                'limit' => 5,
                'order' => [
                    'by' => 'date',
                    'dir' => 'desc'
                ],
                'show_date' => false,
                'pagination' => true,
                'url_taxonomy_filters' => true
            ]
        ],
        'root' => false,
        'name' => 'blog_list.md',
        'frontmatter' => 'title: Home
',
        'slug' => 'home',
        'ordering' => true
    ]
];
