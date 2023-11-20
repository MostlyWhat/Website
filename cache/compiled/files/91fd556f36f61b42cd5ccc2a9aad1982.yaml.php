<?php
return [
    '@class' => 'Grav\\Common\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/plugins/admin/blueprints/admin/pages/copy.yaml',
    'modified' => 1696264967,
    'size' => 842,
    'data' => [
        'rules' => [
            'slug' => [
                'pattern' => '[a-zA-Zа-яA-Я0-9_\\-]+',
                'min' => 1,
                'max' => 200
            ]
        ],
        'form' => [
            'validation' => 'loose',
            'fields' => [
                'section' => [
                    'type' => 'section',
                    'title' => 'PLUGIN_ADMIN.COPY_PAGE'
                ],
                'title' => [
                    'type' => 'text',
                    'label' => 'PLUGIN_ADMIN.PAGE_TITLE',
                    'help' => 'PLUGIN_ADMIN.PAGE_TITLE_HELP',
                    'validate' => [
                        'required' => true
                    ]
                ],
                'folder' => [
                    'type' => 'text',
                    'label' => 'PLUGIN_ADMIN.FOLDER_NAME',
                    'help' => 'PLUGIN_ADMIN.FOLDER_NAME_HELP',
                    'validate' => [
                        'rule' => 'slug',
                        'required' => true
                    ]
                ],
                'header.published' => [
                    'id' => 'move-header-published',
                    'type' => 'toggle',
                    'label' => 'PLUGIN_ADMIN.PUBLISHED',
                    'help' => 'PLUGIN_ADMIN.PUBLISHED_HELP',
                    'highlight' => '',
                    'default' => '',
                    'size' => 'medium',
                    'options' => [
                        '' => 'PLUGIN_ADMIN.AUTO',
                        1 => 'PLUGIN_ADMIN.YES',
                        0 => 'PLUGIN_ADMIN.NO'
                    ],
                    'validate' => [
                        'type' => 'bool'
                    ]
                ]
            ]
        ]
    ]
];
