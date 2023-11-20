<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/plugins/gantry5/engines/nucleus/particles/messages.yaml',
    'modified' => 1698650920,
    'data' => [
        'name' => 'System Messages',
        'description' => 'Display system messages.',
        'type' => 'system',
        'icon' => 'fa-exclamation-circle',
        'hidden' => false,
        'form' => [
            'fields' => [
                'enabled' => [
                    'type' => 'input.checkbox',
                    'label' => 'Enabled',
                    'description' => 'Globally enable system messages.',
                    'default' => true
                ],
                '_info' => [
                    'type' => 'separator.note',
                    'class' => 'alert alert-info',
                    'content' => 'Displays system messages in your layout.'
                ],
                '_alert' => [
                    'type' => 'separator.note',
                    'class' => 'alert alert-warning',
                    'content' => 'Always include this particle to all of your layouts. Otherwise users will not see important system messages like login failures.'
                ]
            ]
        ]
    ]
];
