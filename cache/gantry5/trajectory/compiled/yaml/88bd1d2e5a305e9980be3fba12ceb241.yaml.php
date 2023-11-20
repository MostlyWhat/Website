<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/themes/trajectory/gantry/theme.yaml',
    'modified' => 1698902767,
    'data' => [
        'details' => [
            'name' => 'Trajectory',
            'version' => '1.0.0',
            'icon' => 'paper-plane',
            'date' => 'October 30, 2023',
            'author' => [
                'name' => 'MostlyWhat Systems',
                'email' => 'admin@mostlywhat.com',
                'link' => 'http://www.mostlywhat.com'
            ],
            'documentation' => [
                'link' => 'http://docs.gantry.org/gantry5'
            ],
            'support' => [
                'link' => 'https://gitter.im/gantry/gantry5'
            ],
            'updates' => [
                'link' => 'http://updates.rockettheme.com/themes/trajectory.yaml'
            ],
            'copyright' => '(C) 2005 - 2022 MostlyWhat Systems. All rights reserved.',
            'license' => 'GPLv2',
            'description' => 'Trajectory Theme',
            'images' => [
                'thumbnail' => 'admin/images/preset1.png',
                'preview' => 'admin/images/preset1.png'
            ]
        ],
        'configuration' => [
            'gantry' => [
                'platform' => 'grav',
                'engine' => 'nucleus'
            ],
            'theme' => [
                'parent' => 'trajectory',
                'base' => 'gantry-theme://common',
                'file' => 'gantry-theme://includes/theme.php',
                'class' => '\\Gantry\\Framework\\Theme'
            ],
            'fonts' => [
                'DM Sans' => [
                    '100italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-100-italic',
                    100 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-100-normal',
                    '200italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-200-italic',
                    200 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-200-normal',
                    '300italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-300-italic',
                    300 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-300-normal',
                    '400italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-400-italic',
                    400 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-400-normal',
                    '500italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-500-italic',
                    500 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-500-normal',
                    '600italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-600-italic',
                    600 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-600-normal',
                    '700italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-700-italic',
                    700 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-700-normal',
                    '800italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-800-italic',
                    800 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-800-normal',
                    '900italic' => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-900-italic',
                    900 => 'gantry-theme://fonts/dm-sans/webfonts/dm-sans-latin-900-normal'
                ],
                'DM Mono' => [
                    '300italic' => 'gantry-theme://fonts/dm-mono/webfonts/dm-mono-latin-300-italic',
                    300 => 'gantry-theme://fonts/dm-mono/webfonts/dm-mono-latin-300-normal',
                    '400italic' => 'gantry-theme://fonts/dm-mono/webfonts/dm-mono-latin-400-italic',
                    400 => 'gantry-theme://fonts/dm-mono/webfonts/dm-mono-latin-400-normal',
                    '500italic' => 'gantry-theme://fonts/dm-mono/webfonts/dm-mono-latin-500-italic',
                    500 => 'gantry-theme://fonts/dm-mono/webfonts/dm-mono-latin-500-normal'
                ],
                'Metropolis' => [
                    '100italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-100-italic',
                    100 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-100-normal',
                    '200italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-200-italic',
                    200 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-200-normal',
                    '300italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-300-italic',
                    300 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-300-normal',
                    '400italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-400-italic',
                    400 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-400-normal',
                    '500italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-500-italic',
                    500 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-500-normal',
                    '600italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-600-italic',
                    600 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-600-normal',
                    '700italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-700-italic',
                    700 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-700-normal',
                    '800italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-800-italic',
                    800 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-800-normal',
                    '900italic' => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-900-italic',
                    900 => 'gantry-theme://fonts/metropolis/webfonts/metropolis-latin-900-normal'
                ]
            ],
            'css' => [
                'compiler' => '\\Gantry\\Component\\Stylesheet\\ScssCompiler',
                'options' => [
                    'compatibility' => '5.5',
                    'deprecations' => true
                ],
                'target' => 'gantry-theme://css-compiled',
                'paths' => [
                    0 => 'gantry-theme://scss',
                    1 => 'gantry-engine://scss'
                ],
                'files' => [
                    0 => 'trajectory',
                    1 => 'trajectory-grav',
                    2 => 'custom'
                ],
                'persistent' => [
                    0 => 'trajectory',
                    1 => 'trajectory-grav'
                ],
                'overrides' => [
                    0 => 'custom'
                ]
            ],
            'dependencies' => [
                'gantry' => '5.5'
            ],
            'section-variations' => [
                'Padding Variations' => [
                    'section-vertical-paddings' => 'Section Vertical Paddings',
                    'section-horizontal-paddings' => 'Section Horizontal Paddings',
                    'section-vertical-paddings-large' => 'Large Vertical Paddings',
                    'section-horizontal-paddings-large' => 'Large Horizontal Paddings',
                    'section-vertical-paddings-small' => 'Small Vertical Paddings',
                    'section-horizontal-paddings-small' => 'Small Horizontal Paddings'
                ],
                'Utility' => [
                    'nomarginall' => 'No Margin',
                    'nopaddingall' => 'No Padding'
                ]
            ],
            'block-variations' => [
                'Title Variations' => [
                    'title1' => 'Title 1',
                    'title2' => 'Title 2',
                    'title-gradient' => 'Title Gradient',
                    'title-outline' => 'Title Outline'
                ],
                'Box Variations' => [
                    'box1' => 'Box 1',
                    'box2' => 'Box 2',
                    'box-gradient' => 'Box Gradient',
                    'box-outline' => 'Box Outline'
                ],
                'Effects' => [
                    'spaced' => 'Spaced',
                    'shadow' => 'Shadow',
                    'rounded' => 'Rounded'
                ],
                'Utility' => [
                    'center' => 'Center',
                    'title-center' => 'Centered Title',
                    'equal-height' => 'Equal Height',
                    'disabled' => 'Disabled',
                    'align-right' => 'Align Right',
                    'align-left' => 'Align Left',
                    'nomarginall' => 'No Margin',
                    'nopaddingall' => 'No Padding'
                ]
            ]
        ],
        'admin' => [
            'styles' => [
                'core' => [
                    0 => 'base',
                    1 => 'accent',
                    2 => 'font'
                ],
                'section' => [
                    0 => 'navigation',
                    1 => 'header',
                    2 => 'intro',
                    3 => 'features',
                    4 => 'utility',
                    5 => 'above',
                    6 => 'testimonials',
                    7 => 'expanded',
                    8 => 'main',
                    9 => 'sidebar',
                    10 => 'footer',
                    11 => 'offcanvas'
                ],
                'configuration' => [
                    0 => 'breakpoints'
                ]
            ]
        ]
    ]
];
