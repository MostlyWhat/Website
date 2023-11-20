<?php
return [
    '@class' => 'Grav\\Common\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/plugins/adminidenticons/blueprints.yaml',
    'modified' => 1554583800,
    'size' => 2929,
    'data' => [
        'name' => 'Admin Identicons',
        'version' => '1.1.0',
        'description' => 'Use Identicons for avatars in the Admin-plugin.',
        'icon' => 'user-circle',
        'author' => [
            'name' => 'Ole Vik',
            'email' => 'git@olevik.me',
            'url' => 'http://olevik.me'
        ],
        'homepage' => 'https://github.com/olevik/grav-plugin-adminidenticons',
        'keywords' => 'avatar, avatars, identicon, identicons',
        'bugs' => 'https://github.com/olevik/grav-plugin-adminidenticons/issues',
        'license' => 'MIT',
        'dependencies' => [
            0 => [
                'name' => 'grav',
                'version' => '>=1.2'
            ],
            1 => [
                'name' => 'admin',
                'version' => '>=1.3.2'
            ]
        ],
        'form' => [
            'validation' => 'loose',
            'fields' => [
                'enabled' => [
                    'type' => 'toggle',
                    'label' => 'Plugin Status',
                    'highlight' => 1,
                    'default' => 1,
                    'options' => [
                        1 => 'PLUGIN_ADMIN.ENABLED',
                        0 => 'PLUGIN_ADMIN.DISABLED'
                    ],
                    'validate' => [
                        'type' => 'bool'
                    ]
                ],
                'type' => [
                    'type' => 'select',
                    'size' => 'small',
                    'classes' => 'fancy',
                    'label' => 'Avatar Type',
                    'options' => [
                        'identicon' => 'Identicon',
                        'pattern' => 'Pattern'
                    ]
                ],
                'border_radius' => [
                    'type' => 'range',
                    'label' => 'Border Radius',
                    'id' => 'adminidenticons_border_radius',
                    'default' => 100,
                    'validate' => [
                        'min' => 0,
                        'max' => 100
                    ]
                ],
                'section_identicon' => [
                    'type' => 'section',
                    'title' => 'Identicon styling',
                    'underline' => true,
                    'fields' => [
                        'background' => [
                            'type' => 'colorpicker',
                            'label' => 'Background color'
                        ],
                        'foreground' => [
                            'type' => 'colorpicker',
                            'label' => 'Foreground color'
                        ],
                        'varied' => [
                            'type' => 'toggle',
                            'label' => 'Varied foreground colors',
                            'highlight' => 1,
                            'default' => 1,
                            'options' => [
                                1 => 'PLUGIN_ADMIN.ENABLED',
                                0 => 'PLUGIN_ADMIN.DISABLED'
                            ],
                            'validate' => [
                                'type' => 'bool'
                            ]
                        ],
                        'padding' => [
                            'type' => 'range',
                            'label' => 'Padding',
                            'id' => 'adminidenticons_padding',
                            'default' => 28,
                            'validate' => [
                                'min' => 4,
                                'max' => 60
                            ]
                        ],
                        'spacing' => [
                            'type' => 'range',
                            'label' => 'Spacing',
                            'id' => 'adminidenticons_spacing',
                            'default' => 0,
                            'validate' => [
                                'min' => 0,
                                'max' => 30
                            ]
                        ],
                        'rows' => [
                            'type' => 'range',
                            'label' => 'Rows',
                            'id' => 'adminidenticons_rows',
                            'default' => 0,
                            'validate' => [
                                'min' => 0,
                                'max' => 20
                            ]
                        ],
                        'columns' => [
                            'type' => 'range',
                            'label' => 'Columns',
                            'id' => 'adminidenticons_columns',
                            'default' => 0,
                            'validate' => [
                                'min' => 0,
                                'max' => 20
                            ]
                        ]
                    ]
                ],
                'section_pattern' => [
                    'type' => 'section',
                    'title' => 'Pattern styling',
                    'text' => 'Allowable number of tiles and colors to use in pattern. WARNING: Values higher than 12 cause higher levels of memory- and processing power-usage.',
                    'underline' => true,
                    'fields' => [
                        'tiles' => [
                            'type' => 'range',
                            'label' => 'Tiles',
                            'id' => 'adminidenticons_tiles',
                            'default' => 6,
                            'validate' => [
                                'min' => 1,
                                'max' => 25
                            ]
                        ],
                        'colors' => [
                            'type' => 'range',
                            'label' => 'Colors',
                            'id' => 'adminidenticons_colors',
                            'default' => 2,
                            'validate' => [
                                'min' => 1,
                                'max' => 25
                            ]
                        ]
                    ]
                ]
            ]
        ]
    ]
];
