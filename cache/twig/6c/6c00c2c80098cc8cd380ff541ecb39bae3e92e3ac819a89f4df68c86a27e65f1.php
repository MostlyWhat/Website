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

/* forms/fields/pagemedia/pagemedia.html.twig */
class __TwigTemplate_5b0ecb7fc32a229d64ff60e0de003018487310bc7eb33a0ad3f6d53e61d30663 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'field' => [$this, 'block_field'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "forms/field.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 3
        $context["value"] = (((null === ($context["value"] ?? null))) ? ($this->getAttribute(($context["field"] ?? null), "default", [])) : (($context["value"] ?? null)));
        // line 1
        $this->parent = $this->loadTemplate("forms/field.html.twig", "forms/fields/pagemedia/pagemedia.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 5
    public function block_field($context, array $blocks = [])
    {
        // line 6
        if ($this->getAttribute(($context["context"] ?? null), "folderExists", [])) {
            // line 7
            echo "    ";
            $context["pagemedia"] = $this->getAttribute(($context["config"] ?? null), "get", [0 => "plugins.admin.pagemedia"], "method");
            // line 8
            echo "    ";
            $context["pagemedia_settings"] = ["resolution" => ["min" => ["width" => (($this->getAttribute(            // line 11
($context["pagemedia"] ?? null), "res_min_width", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "res_min_width", [])) : (null)), "height" => (($this->getAttribute(            // line 12
($context["pagemedia"] ?? null), "res_min_height", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "res_min_height", [])) : (null))], "max" => ["width" => (($this->getAttribute(            // line 15
($context["pagemedia"] ?? null), "res_max_width", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "res_max_width", [])) : (null)), "height" => (($this->getAttribute(            // line 16
($context["pagemedia"] ?? null), "res_max_height", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "res_max_height", [])) : (null))]], "resizeWidth" => (($this->getAttribute(            // line 19
($context["pagemedia"] ?? null), "resize_width", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "resize_width", [])) : (null)), "resizeHeight" => (($this->getAttribute(            // line 20
($context["pagemedia"] ?? null), "resize_height", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "resize_height", [])) : (null)), "resizeQuality" => (($this->getAttribute(            // line 21
($context["pagemedia"] ?? null), "resize_quality", [])) ? ($this->getAttribute(($context["pagemedia"] ?? null), "resize_quality", [])) : (0.8000000000000000444089209850062616169452667236328125))];
            // line 23
            echo "
    ";
            // line 24
            $context["media_url"] = (($this->getAttribute(($context["form"] ?? null), "getMediaTaskRoute", [], "method")) ? ($this->getAttribute(($context["form"] ?? null), "getMediaTaskRoute", [], "method")) : ((("/media/" . twig_trim_filter($this->getAttribute(($context["admin"] ?? null), "route", []), "/")) . ".json")));
            // line 25
            echo "    ";
            $context["media_local"] = (($this->getAttribute(($context["form"] ?? null), "getMediaRoute", [], "method")) ? ($this->getAttribute(($context["form"] ?? null), "getMediaRoute", [], "method")) : ((($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->rtrimFilter(($context["base_url_relative_frontend"] ?? null), "/") . "/") . twig_trim_filter($this->getAttribute(($context["admin"] ?? null), "route", []), "/"))));
            // line 26
            echo "    ";
            $context["media_path"] = $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->urlFunc($this->getAttribute(($context["context"] ?? null), "relativePagePath", []));
            // line 27
            echo "    ";
            $context["media_uri"] = $this->getAttribute(($context["context"] ?? null), "mediaUri", [], "method");
            // line 28
            echo "    ";
            $context["dropzone_settings"] = twig_array_merge(["maxFilesize" => ($context["form_max_filesize"] ?? null)], ($context["pagemedia_settings"] ?? null));
            // line 29
            echo "    ";
            $context["pageMediaStore"] = $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->jsonDecodeFilter(_twig_default_filter($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->getCookie("grav-admin-pagemedia"), "{\"width\":200,\"collapsed\":false}"));
            // line 30
            echo "
    <div class=\"pagemedia-field form-field grid vertical ";
            // line 31
            if ($this->getAttribute(($context["field"] ?? null), "classes", [], "any", true, true)) {
                echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "classes", []), "html", null, true);
            }
            echo "\">
    <div class=\"form-label\">
        <label class=\"media-collapser\">
          <i class=\"fa fa-fw small fa-chevron-";
            // line 34
            echo (($this->getAttribute(($context["pageMediaStore"] ?? null), "collapsed", [])) ? ("right") : ("down"));
            echo "\"></i>
          ";
            // line 35
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, $this->getAttribute(($context["field"] ?? null), "label", [])), "html", null, true);
            echo " <span data-pagemedia-count>(";
            echo twig_escape_filter($this->env, twig_length_filter($this->env, $this->getAttribute($this->getAttribute(($context["admin"] ?? null), "page", []), "media", [])), "html", null, true);
            echo ")</span>
        </label>
        <div class=\"";
            // line 37
            echo (($this->getAttribute(($context["pageMediaStore"] ?? null), "collapsed", [])) ? ("hidden") : (""));
            echo "\">
          <input type=\"range\" min=\"70\" step=\"10\" max=\"200\" value=\"";
            // line 38
            echo twig_escape_filter($this->env, $this->getAttribute(($context["pageMediaStore"] ?? null), "width", []), "html", null, true);
            echo "\" class=\"media-resizer\">
        </div>
    </div>
    <div class=\"form-data form-uploads-wrapper\" style=\"";
            // line 41
            echo (($this->getAttribute(($context["pageMediaStore"] ?? null), "collapsed", [])) ? ("display: none;") : (""));
            echo "\">
        <div id=\"grav-dropzone\"
             class=\"dropzone\"
             data-media-url=\"";
            // line 44
            echo twig_escape_filter($this->env, (($context["base_url"] ?? null) . ($context["media_url"] ?? null)), "html_attr");
            echo "\"
             data-media-local=\"";
            // line 45
            echo twig_escape_filter($this->env, ($context["media_local"] ?? null), "html_attr");
            echo "\"
             data-media-path=\"";
            // line 46
            echo twig_escape_filter($this->env, ($context["media_path"] ?? null), "html_attr");
            echo "\"
             data-media-uri=\"";
            // line 47
            echo twig_escape_filter($this->env, ($context["media_uri"] ?? null), "html_attr");
            echo "\"
             data-dropzone-options=\"";
            // line 48
            echo twig_escape_filter($this->env, twig_jsonencode_filter(($context["dropzone_settings"] ?? null)), "html_attr");
            echo "\"
             data-dropzone-field=\"";
            // line 49
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))), "html", null, true);
            echo "\"></div>

        ";
            // line 51
            if ((($this->getAttribute($this->getAttribute(($context["admin"] ?? null), "session", []), "expert", []) == "0") ||  !$this->getAttribute(($context["user"] ?? null), "authorize", [0 => "admin.super"], "method"))) {
                // line 52
                echo "        <input type=\"hidden\" name=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))), "html", null, true);
                echo "\" value=\"";
                echo twig_escape_filter($this->env, ($context["value"] ?? null), "html", null, true);
                echo "\" />
        ";
            }
            // line 54
            echo "    </div>
</div>
";
        } else {
            // line 57
            echo "<div class=\"form-tab\">
    <div class=\"form-field\">
        <div class=\"form-label\">
            ";
            // line 60
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.CANNOT_ADD_MEDIA_FILES_PAGE_NOT_SAVED"), "html", null, true);
            echo "
        </div>
    </div>
</div>
";
        }
    }

    public function getTemplateName()
    {
        return "forms/fields/pagemedia/pagemedia.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  163 => 60,  158 => 57,  153 => 54,  145 => 52,  143 => 51,  138 => 49,  134 => 48,  130 => 47,  126 => 46,  122 => 45,  118 => 44,  112 => 41,  106 => 38,  102 => 37,  95 => 35,  91 => 34,  83 => 31,  80 => 30,  77 => 29,  74 => 28,  71 => 27,  68 => 26,  65 => 25,  63 => 24,  60 => 23,  58 => 21,  57 => 20,  56 => 19,  55 => 16,  54 => 15,  53 => 12,  52 => 11,  50 => 8,  47 => 7,  45 => 6,  42 => 5,  37 => 1,  35 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"forms/field.html.twig\" %}

{% set value = (value is null ? field.default : value) %}

{% block field %}
{% if context.folderExists %}
    {% set pagemedia = config.get('plugins.admin.pagemedia') %}
    {% set pagemedia_settings = {
        resolution: {
            min: {
                width: pagemedia.res_min_width ?: null,
                height: pagemedia.res_min_height ?: null
            },
            max: {
                width: pagemedia.res_max_width ?: null,
                height: pagemedia.res_max_height ?: null
            }
        },
        resizeWidth: pagemedia.resize_width ?: null,
        resizeHeight: pagemedia.resize_height ?: null,
        resizeQuality: pagemedia.resize_quality ?: 0.8
    } %}

    {% set media_url = form.getMediaTaskRoute() ?: '/media/' ~ admin.route|trim('/') ~ '.json' %}
    {% set media_local = form.getMediaRoute() ?: base_url_relative_frontend|rtrim('/') ~ '/' ~ admin.route|trim('/') %}
    {% set media_path = url(context.relativePagePath) %}
    {% set media_uri = context.mediaUri() %}
    {% set dropzone_settings = { maxFilesize: form_max_filesize }|merge(pagemedia_settings) %}
    {% set pageMediaStore = get_cookie('grav-admin-pagemedia')|default('{\"width\":200,\"collapsed\":false}')|json_decode %}

    <div class=\"pagemedia-field form-field grid vertical {% if field.classes is defined %}{{ field.classes }}{% endif %}\">
    <div class=\"form-label\">
        <label class=\"media-collapser\">
          <i class=\"fa fa-fw small fa-chevron-{{ pageMediaStore.collapsed ? 'right' : 'down' }}\"></i>
          {{ field.label|t }} <span data-pagemedia-count>({{ admin.page.media|length }})</span>
        </label>
        <div class=\"{{ pageMediaStore.collapsed ? 'hidden' : '' }}\">
          <input type=\"range\" min=\"70\" step=\"10\" max=\"200\" value=\"{{ pageMediaStore.width }}\" class=\"media-resizer\">
        </div>
    </div>
    <div class=\"form-data form-uploads-wrapper\" style=\"{{ pageMediaStore.collapsed ? 'display: none;' : '' }}\">
        <div id=\"grav-dropzone\"
             class=\"dropzone\"
             data-media-url=\"{{ (base_url ~ media_url)|e('html_attr') }}\"
             data-media-local=\"{{ media_local|e('html_attr') }}\"
             data-media-path=\"{{ media_path|e('html_attr') }}\"
             data-media-uri=\"{{ media_uri|e('html_attr') }}\"
             data-dropzone-options=\"{{ dropzone_settings|json_encode|e('html_attr') }}\"
             data-dropzone-field=\"{{ (scope ~ field.name)|fieldName }}\"></div>

        {% if admin.session.expert == '0' or not user.authorize('admin.super') %}
        <input type=\"hidden\" name=\"{{ (scope ~ field.name)|fieldName }}\" value=\"{{ value }}\" />
        {% endif %}
    </div>
</div>
{% else %}
<div class=\"form-tab\">
    <div class=\"form-field\">
        <div class=\"form-label\">
            {{ \"PLUGIN_ADMIN.CANNOT_ADD_MEDIA_FILES_PAGE_NOT_SAVED\"|t }}
        </div>
    </div>
</div>
{% endif %}
{% endblock %}
", "forms/fields/pagemedia/pagemedia.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\forms\\fields\\pagemedia\\pagemedia.html.twig");
    }
}
