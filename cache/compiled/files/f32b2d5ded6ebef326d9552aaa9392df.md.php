<?php
return [
    '@class' => 'Grav\\Common\\File\\CompiledMarkdownFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/pages/04.transmissions/blog_list.md',
    'modified' => 1698999169,
    'size' => 252,
    'data' => [
        'header' => [
            'title' => 'Transmissions',
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
        'frontmatter' => 'title: Transmissions
content:
    items:
        - \'@self.children\'
    leading: 0
    columns: 2
    limit: 5
    order:
        by: date
        dir: desc
    show_date: false
    pagination: true
    url_taxonomy_filters: true',
        'markdown' => 'Transmissions'
    ]
];
