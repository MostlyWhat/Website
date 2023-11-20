<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* flex-objects/types/default/edit.html.twig */
class __TwigTemplate_22ded576d2c0b9ae96271637a387d0b532556ec747c3260fb143892468dac065 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $_trait_0 = $this->loadTemplate("flex-objects/types/default/titlebar/edit.html.twig", "flex-objects/types/default/edit.html.twig", 2);
        // line 2
        if (!$_trait_0->isTraitable()) {
            throw new RuntimeError('Template "'."flex-objects/types/default/titlebar/edit.html.twig".'" cannot be used as a trait.', 2, $this->getSourceContext());
        }
        $_trait_0_blocks = $_trait_0->getBlocks();

        $this->traits = $_trait_0_blocks;

        $this->blocks = array_merge(
            $this->traits,
            [
                'body' => [$this, 'block_body'],
                'content_top' => [$this, 'block_content_top'],
                'content' => [$this, 'block_content'],
                'topbar' => [$this, 'block_topbar'],
                'edit' => [$this, 'block_edit'],
            ]
        );
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "partials/base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 5
        if ( !array_key_exists("form", $context)) {
            // line 6
            $context["form"] = $this->getAttribute(($context["object"] ?? null), "form", []);
            // line 7
            $context["object"] = $this->getAttribute(($context["form"] ?? null), "object", []);
        }
        // line 11
        $context["can_list"] = (($context["can_list"]) ?? ($this->getAttribute(($context["directory"] ?? null), "isAuthorized", [0 => "list", 1 => "admin", 2 => ($context["user"] ?? null)], "method")));
        // line 12
        $context["can_read"] = (($context["can_read"]) ?? ((($this->getAttribute(($context["object"] ?? null), "exists", [])) ? ($this->getAttribute(($context["object"] ?? null), "isAuthorized", [0 => "read", 1 => "admin", 2 => ($context["user"] ?? null)], "method")) : ($this->getAttribute(($context["directory"] ?? null), "isAuthorized", [0 => "create", 1 => "admin", 2 => ($context["user"] ?? null)], "method")))));
        // line 13
        $context["can_create"] = (($context["can_create"]) ?? ($this->getAttribute(($context["object"] ?? null), "isAuthorized", [0 => "create", 1 => "admin", 2 => ($context["user"] ?? null)], "method")));
        // line 14
        $context["can_save"] = (($context["can_save"]) ?? ((($this->getAttribute(($context["object"] ?? null), "exists", [])) ? ($this->getAttribute(($context["object"] ?? null), "isAuthorized", [0 => "update", 1 => "admin", 2 => ($context["user"] ?? null)], "method")) : ($this->getAttribute(($context["directory"] ?? null), "isAuthorized", [0 => "create", 1 => "admin", 2 => ($context["user"] ?? null)], "method")))));
        // line 15
        $context["can_delete"] = (($context["can_delete"]) ?? (($this->getAttribute(($context["object"] ?? null), "exists", []) && $this->getAttribute(($context["object"] ?? null), "isAuthorized", [0 => "delete", 1 => "admin", 2 => ($context["user"] ?? null)], "method"))));
        // line 16
        $context["can_translate"] = (($context["can_translate"]) ?? (($this->getAttribute(($context["admin"] ?? null), "multilang", []) && $this->getAttribute(($context["object"] ?? null), "hasFlexFeature", [0 => "flex-translate"], "method"))));
        // line 17
        $context["can_preview"] = (($context["can_preview"]) ?? (((($context["can_read"] ?? null) && $this->getAttribute(($context["object"] ?? null), "exists", [])) && ((($this->getAttribute(($context["directory"] ?? null), "config", [0 => "admin.views.preview.enabled"], "method", true, true) &&  !(null === $this->getAttribute(($context["directory"] ?? null), "config", [0 => "admin.views.preview.enabled"], "method")))) ? ($this->getAttribute(($context["directory"] ?? null), "config", [0 => "admin.views.preview.enabled"], "method")) : ($this->getAttribute(($context["directory"] ?? null), "config", [0 => "admin.preview.enabled", 1 => false], "method"))))));
        // line 20
        if (($context["can_translate"] ?? null)) {
            // line 21
            $context["translate_include_default"] = (($context["translate_include_default"]) ?? ($this->getAttribute($this->getAttribute(($context["grav"] ?? null), "config", []), "get", [0 => "system.languages.include_default_lang_file_extension", 1 => true], "method")));
            // line 22
            $context["all_languages"] = $this->getAttribute($this->getAttribute(($context["grav"] ?? null), "admin", []), "siteLanguages", []);
            // line 23
            $context["admin_languages"] = $this->getAttribute(($context["admin"] ?? null), "languages_enabled", []);
            // line 24
            $context["default_language"] = $this->getAttribute($this->getAttribute(($context["grav"] ?? null), "language", []), "default", []);
            // line 25
            $context["object_language"] = $this->getAttribute(($context["object"] ?? null), "language", []);
            // line 26
            $context["language"] = $this->getAttribute(($context["controller"] ?? null), "language", []);
            // line 27
            $context["has_translation"] = $this->getAttribute(($context["object"] ?? null), "hasTranslation", [0 => ($context["language"] ?? null), 1 => false], "method");
            // line 36
            $context["language"] = ((($context["language"] ?? null)) ? (($context["language"] ?? null)) : (($context["default_language"] ?? null)));
            // line 37
            $context["object_language"] = ((($context["object_language"] ?? null)) ? (($context["object_language"] ?? null)) : (($context["default_language"] ?? null)));
            // line 38
            $context["object_languages"] = $this->getAttribute(($context["object"] ?? null), "languages", [0 => false], "method");
        }
        // line 43
        $context["allowed"] = (($context["allowed"]) ?? (((($context["directory"] ?? null) && ($this->getAttribute(($context["object"] ?? null), "exists", []) && (($context["can_read"] ?? null) || ($context["can_save"] ?? null)))) || ((($context["action"] ?? null) == "add") && ($context["can_read"] ?? null)))));
        // line 44
        $context["back_route"] = (($context["back_route"]) ?? (("/" . ((((($context["action"] ?? null) != "edit") &&  !($context["key"] ?? null))) ? ($this->getAttribute(($context["route"] ?? null), "getRoute", [0 => 1, 1 => (( !($context["can_list"] ?? null)) ? ( -1) : (null))], "method")) : ($this->getAttribute(($context["route"] ?? null), "getRoute", [0 => 1, 1 => (( !($context["can_list"] ?? null)) ? ( -2) : ( -1))], "method"))))));
        // line 45
        $context["title_icon"] = (($context["title_icon"]) ?? (((($this->getAttribute(($context["view_config"] ?? null), "icon", [], "array", true, true) &&  !(null === $this->getAttribute(($context["view_config"] ?? null), "icon", [], "array")))) ? ($this->getAttribute(($context["view_config"] ?? null), "icon", [], "array")) : (((($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["directory"] ?? null), "config", [], "any", false, true), "admin", [], "any", false, true), "menu", [], "any", false, true), "list", [], "any", false, true), "icon", [], "any", true, true) &&  !(null === $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["directory"] ?? null), "config", [], "any", false, true), "admin", [], "any", false, true), "menu", [], "any", false, true), "list", [], "any", false, true), "icon", [])))) ? ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["directory"] ?? null), "config", [], "any", false, true), "admin", [], "any", false, true), "menu", [], "any", false, true), "list", [], "any", false, true), "icon", [])) : ("fa-file-text-o"))))));
        // line 46
        ob_start();
        // line 47
        $context["title_config"] = $this->getAttribute(($context["view_config"] ?? null), "title", [], "array");
        // line 48
        if ($this->getAttribute(($context["title_config"] ?? null), "template", [])) {
            // line 49
            echo twig_include($this->env, $context, twig_template_from_string($this->env, $this->getAttribute(($context["title_config"] ?? null), "template", []), "edit title template"));
        } else {
            // line 51
            echo twig_escape_filter($this->env, (($context["title"]) ?? (((($this->getAttribute($this->getAttribute(($context["object"] ?? null), "form", [], "any", false, true), "getValue", [0 => "title"], "method", true, true) &&  !(null === $this->getAttribute($this->getAttribute(($context["object"] ?? null), "form", [], "any", false, true), "getValue", [0 => "title"], "method")))) ? ($this->getAttribute($this->getAttribute(($context["object"] ?? null), "form", [], "any", false, true), "getValue", [0 => "title"], "method")) : (((($this->getAttribute(($context["object"] ?? null), "title", [], "any", true, true) &&  !(null === $this->getAttribute(($context["object"] ?? null), "title", [])))) ? ($this->getAttribute(($context["object"] ?? null), "title", [])) : (($context["key"] ?? null))))))), "html", null, true);
        }
        $context["title"] = ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 1
        $this->parent = $this->loadTemplate("partials/base.html.twig", "flex-objects/types/default/edit.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 55
    public function block_body($context, array $blocks = [])
    {
        // line 56
        echo "    ";
        $context["back_url"] = (($context["back_url"]) ?? ($this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->adminRouteFunc(($context["back_route"] ?? null))));
        // line 57
        echo "    ";
        $context["id"] = ($context["key"] ?? null);
        // line 58
        echo "    ";
        $context["blueprint"] = (($context["blueprint"]) ?? ($this->getAttribute(($context["form"] ?? null), "blueprint", [])));
        // line 59
        echo "
    ";
        // line 60
        $this->displayParentBlock("body", $context, $blocks);
        echo "
";
    }

    // line 63
    public function block_content_top($context, array $blocks = [])
    {
        // line 64
        echo "    ";
        if ((($context["allowed"] ?? null) && $this->getAttribute(($context["user"] ?? null), "authorize", [0 => "admin.super"], "method"))) {
            // line 65
            echo "        ";
            if (((($context["directory"] ?? null) && ($context["object"] ?? null)) || (($context["action"] ?? null) == "add"))) {
                // line 66
                echo "            ";
                $context["save_location"] = ((($this->getAttribute(($context["object"] ?? null), "getStorageFolder", [], "method", true, true) &&  !(null === $this->getAttribute(($context["object"] ?? null), "getStorageFolder", [], "method")))) ? ($this->getAttribute(($context["object"] ?? null), "getStorageFolder", [], "method")) : ($this->getAttribute(($context["directory"] ?? null), "getStorageFolder", [], "method")));
                // line 67
                echo "            <div class=\"alert notice\">";
                echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.SAVE_LOCATION"), "html", null, true);
                echo ": <b>";
                echo twig_escape_filter($this->env, twig_trim_filter($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->urlFunc(($context["save_location"] ?? null), false, true), "/"), "html", null, true);
                echo " ";
                (( !$this->getAttribute(($context["object"] ?? null), "exists", [])) ? (print (twig_escape_filter($this->env, (("[" . twig_upper_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.NEW"))) . "]"), "html", null, true))) : (print ("")));
                echo "</b></div>
        ";
            }
            // line 69
            echo "    ";
        }
        // line 70
        echo "    ";
        if (($this->getAttribute(($context["object"] ?? null), "exists", []) && $this->getAttribute($this->getAttribute(($context["form"] ?? null), "flash", []), "exists", []))) {
            // line 71
            echo "        <div class=\"alert secondary-accent\">
            <i class=\"fa fa-lightbulb-o\"></i> ";
            // line 72
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.STATE.EDITING_DRAFT"), "html", null, true);
            echo " <button class=\"button button-link\" type=\"submit\" name=\"task\" value=\"reset\" form=\"blueprints\">";
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.RESET"), "html", null, true);
            echo "</button>
        </div>
    ";
        }
    }

    // line 77
    public function block_content($context, array $blocks = [])
    {
        // line 78
        echo "    ";
        if (($context["allowed"] ?? null)) {
            // line 79
            echo "        <div class=\"clear directory admin-";
            echo twig_escape_filter($this->env, ($context["target"] ?? null), "html", null, true);
            echo "\">
            <div class=\"admin-form-wrapper\">
                <div id=\"admin-topbar\">
                    ";
            // line 82
            $this->displayBlock('topbar', $context, $blocks);
            // line 83
            echo "                </div>
                ";
            // line 84
            $this->displayBlock('edit', $context, $blocks);
            // line 87
            echo "            </div>
        </div>

        ";
            // line 90
            $this->loadTemplate("partials/modal-changes-detected.html.twig", "flex-objects/types/default/edit.html.twig", 90)->display($context);
            // line 91
            echo "
        ";
            // line 92
            if (($context["can_delete"] ?? null)) {
                // line 93
                echo "            ";
                $this->loadTemplate([0 => (("flex-objects/types/" . ($context["target"] ?? null)) . "/modals/remove.html.twig"), 1 => "flex-objects/types/default/modals/remove.html.twig"], "flex-objects/types/default/edit.html.twig", 93)->display(twig_array_merge($context, ["name" => ($context["target"] ?? null)]));
                // line 94
                echo "        ";
            }
            // line 95
            echo "
    ";
        } elseif ($this->getAttribute(        // line 96
($context["object"] ?? null), "exists", [])) {
            // line 97
            echo "
        ";
            // line 98
            $this->getAttribute(($context["page"] ?? null), "modifyHeader", [0 => "http_response_code", 1 => 403], "method");
            // line 99
            echo "        <div class=\"error-block\">
            <h1>";
            // line 100
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.ERROR"), "html", null, true);
            echo " 403</h1>
            <div class=\"padding\">
                <p>
                    ";
            // line 103
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.ERROR.PAGE_FORBIDDEN"), "html", null, true);
            echo "
                </p>
            </div>
        </div>

    ";
        } else {
            // line 109
            echo "
        ";
            // line 110
            $this->getAttribute(($context["page"] ?? null), "modifyHeader", [0 => "http_response_code", 1 => 404], "method");
            // line 111
            echo "        <div class=\"error-block\">
            <h1>";
            // line 112
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_ADMIN.ERROR"), "html", null, true);
            echo " 404</h1>
            <div class=\"padding\">
                <p>
                    ";
            // line 115
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Plugin\Admin\Twig\AdminTwigExtension')->tuFilter("PLUGIN_FLEX_OBJECTS.ERROR.PAGE_NOT_EXIST"), "html", null, true);
            echo "
                </p>
            </div>
        </div>

    ";
        }
    }

    // line 82
    public function block_topbar($context, array $blocks = [])
    {
    }

    // line 84
    public function block_edit($context, array $blocks = [])
    {
        // line 85
        echo "                    ";
        $this->loadTemplate("partials/blueprints.html.twig", "flex-objects/types/default/edit.html.twig", 85)->display(twig_array_merge($context, ["form" => ($context["form"] ?? null), "context" => ($context["object"] ?? null), "data" => ($context["object"] ?? null)]));
        // line 86
        echo "                ";
    }

    public function getTemplateName()
    {
        return "flex-objects/types/default/edit.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  283 => 86,  280 => 85,  277 => 84,  272 => 82,  261 => 115,  255 => 112,  252 => 111,  250 => 110,  247 => 109,  238 => 103,  232 => 100,  229 => 99,  227 => 98,  224 => 97,  222 => 96,  219 => 95,  216 => 94,  213 => 93,  211 => 92,  208 => 91,  206 => 90,  201 => 87,  199 => 84,  196 => 83,  194 => 82,  187 => 79,  184 => 78,  181 => 77,  171 => 72,  168 => 71,  165 => 70,  162 => 69,  152 => 67,  149 => 66,  146 => 65,  143 => 64,  140 => 63,  134 => 60,  131 => 59,  128 => 58,  125 => 57,  122 => 56,  119 => 55,  114 => 1,  110 => 51,  107 => 49,  105 => 48,  103 => 47,  101 => 46,  99 => 45,  97 => 44,  95 => 43,  92 => 38,  90 => 37,  88 => 36,  86 => 27,  84 => 26,  82 => 25,  80 => 24,  78 => 23,  76 => 22,  74 => 21,  72 => 20,  70 => 17,  68 => 16,  66 => 15,  64 => 14,  62 => 13,  60 => 12,  58 => 11,  55 => 7,  53 => 6,  51 => 5,  45 => 1,  23 => 2,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends 'partials/base.html.twig' %}
{% use 'flex-objects/types/default/titlebar/edit.html.twig' %}

{# Avoid defining form and object twice: object should always come from the form! #}
{% if form is not defined %}
  {% set form = object.form %}
  {% set object = form.object %}
{% endif %}

{# Allowed actions #}
{% set can_list = can_list ?? directory.isAuthorized('list', 'admin', user) %}
{% set can_read = can_read ?? (object.exists ? object.isAuthorized('read', 'admin', user) : directory.isAuthorized('create', 'admin', user)) %}
{% set can_create = can_create ?? object.isAuthorized('create', 'admin', user) %}
{% set can_save = can_save ?? (object.exists ? object.isAuthorized('update', 'admin', user) : directory.isAuthorized('create', 'admin', user)) %}
{% set can_delete = can_delete ?? (object.exists and object.isAuthorized('delete', 'admin', user)) %}
{% set can_translate = can_translate ?? (admin.multilang and object.hasFlexFeature('flex-translate')) %}
{% set can_preview = can_preview ?? (can_read and object.exists and (directory.config('admin.views.preview.enabled') ?? directory.config('admin.preview.enabled', false))) %}

{# Translations #}
{% if can_translate %}
    {% set translate_include_default = translate_include_default ?? grav.config.get('system.languages.include_default_lang_file_extension', true) %}
    {% set all_languages = grav.admin.siteLanguages %}
    {% set admin_languages = admin.languages_enabled %}
    {% set default_language = grav.language.default %}
    {% set object_language = object.language %}
    {% set language = controller.language %}
    {% set has_translation = object.hasTranslation(language, false) %}

    {#
    {% if translate_include_default %}
        {% set all_languages = all_languages|merge({'': 'Default'}) %}
        {% set admin_languages = admin_languages|merge({'': ''}) %}
        {% set object_languages = object.languages(true) %}
    {% else %}
    #}
        {% set language = language ?: default_language %}
        {% set object_language = object_language ?: default_language %}
        {% set object_languages = object.languages(false) %}
    {# endif #}
{% endif %}

{# These variables can be overridden from the main template file #}
{% set allowed = allowed ?? (directory and (object.exists and (can_read or can_save)) or (action == 'add' and can_read)) %}
{% set back_route = back_route ?? ('/' ~ (action != 'edit' and not key ? route.getRoute(1, not can_list ? -1 : null) : route.getRoute(1, not can_list ? -2 : -1))) %}
{% set title_icon = title_icon ?? view_config['icon'] ?? directory.config.admin.menu.list.icon ?? 'fa-file-text-o' %}
{% set title -%}
    {%- set title_config = view_config['title'] -%}
    {%- if title_config.template -%}
        {{- include(template_from_string(title_config.template, 'edit title template')) -}}
    {%- else -%}
        {{- title ?? object.form.getValue('title') ?? object.title ?? key -}}
    {% endif %}
{%- endset %}

{% block body %}
    {% set back_url = back_url ?? admin_route(back_route) %}
    {% set id = key %}
    {% set blueprint = blueprint ?? form.blueprint %}

    {{ parent() }}
{% endblock body %}

{% block content_top %}
    {% if allowed and user.authorize('admin.super') %}
        {% if directory and object or action == 'add' %}
            {% set save_location = object.getStorageFolder() ?? directory.getStorageFolder() %}
            <div class=\"alert notice\">{{ \"PLUGIN_ADMIN.SAVE_LOCATION\"|tu }}: <b>{{ url(save_location, false, true)|trim('/') }} {{ not object.exists ? '[' ~ 'PLUGIN_FLEX_OBJECTS.NEW'|tu|upper ~ ']' }}</b></div>
        {% endif %}
    {% endif %}
    {% if object.exists and form.flash.exists %}
        <div class=\"alert secondary-accent\">
            <i class=\"fa fa-lightbulb-o\"></i> {{ 'PLUGIN_FLEX_OBJECTS.STATE.EDITING_DRAFT'|tu }} <button class=\"button button-link\" type=\"submit\" name=\"task\" value=\"reset\" form=\"blueprints\">{{ \"PLUGIN_ADMIN.RESET\"|tu }}</button>
        </div>
    {% endif %}
{% endblock %}

{% block content %}
    {% if allowed %}
        <div class=\"clear directory admin-{{ target }}\">
            <div class=\"admin-form-wrapper\">
                <div id=\"admin-topbar\">
                    {% block topbar %}{% endblock %}
                </div>
                {% block edit %}
                    {% include 'partials/blueprints.html.twig' with { form: form, context: object, data: object } %}
                {% endblock %}
            </div>
        </div>

        {% include 'partials/modal-changes-detected.html.twig' %}

        {% if can_delete %}
            {% include ['flex-objects/types/' ~ target ~ '/modals/remove.html.twig', 'flex-objects/types/default/modals/remove.html.twig'] with { name: target } %}
        {% endif %}

    {% elseif (object.exists) %}

        {% do page.modifyHeader('http_response_code', 403) %}
        <div class=\"error-block\">
            <h1>{{ 'PLUGIN_ADMIN.ERROR'|tu }} 403</h1>
            <div class=\"padding\">
                <p>
                    {{ 'PLUGIN_FLEX_OBJECTS.ERROR.PAGE_FORBIDDEN'|tu }}
                </p>
            </div>
        </div>

    {% else %}

        {% do page.modifyHeader('http_response_code', 404) %}
        <div class=\"error-block\">
            <h1>{{ 'PLUGIN_ADMIN.ERROR'|tu }} 404</h1>
            <div class=\"padding\">
                <p>
                    {{ 'PLUGIN_FLEX_OBJECTS.ERROR.PAGE_NOT_EXIST'|tu }}
                </p>
            </div>
        </div>

    {% endif %}
{% endblock %}
", "flex-objects/types/default/edit.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\flex-objects\\admin\\templates\\flex-objects\\types\\default\\edit.html.twig");
    }
}
