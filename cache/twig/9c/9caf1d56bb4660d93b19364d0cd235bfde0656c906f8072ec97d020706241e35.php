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

/* forms/fields/folder-slug/folder-slug.html.twig */
class __TwigTemplate_8483d0cc5345b1279f793fb8e32993cae3c87b5fb88ea77f15455ff912e7e5a1 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'append' => [$this, 'block_append'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "forms/fields/text/text.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 2
        $context["field"] = twig_array_merge(($context["field"] ?? null), ["wrapper_classes" => "form-input-addon-wrapper"]);
        // line 1
        $this->parent = $this->loadTemplate("forms/fields/text/text.html.twig", "forms/fields/folder-slug/folder-slug.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 4
    public function block_append($context, array $blocks = [])
    {
        // line 5
        echo "    <div class=\"form-input-addon form-input-append hint--top\" data-hint=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.AUTOREGENERATE_FOLDER_SLUG"), "html", null, true);
        echo "\" data-regenerate='[name=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldNameFilter((($context["scope"] ?? null) . $this->getAttribute(($context["field"] ?? null), "name", []))), "html", null, true);
        echo "\"]'>
        <i class=\"fa fa-refresh\"></i>
    </div>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/folder-slug/folder-slug.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  45 => 5,  42 => 4,  37 => 1,  35 => 2,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends \"forms/fields/text/text.html.twig\" %}
{% set field = field|merge({'wrapper_classes': 'form-input-addon-wrapper'}) %}

{% block append %}
    <div class=\"form-input-addon form-input-append hint--top\" data-hint=\"{{ 'PLUGIN_ADMIN.AUTOREGENERATE_FOLDER_SLUG'|t }}\" data-regenerate='[name=\"{{ (scope ~ field.name)|fieldName }}\"]'>
        <i class=\"fa fa-refresh\"></i>
    </div>
{% endblock %}
", "forms/fields/folder-slug/folder-slug.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\forms\\fields\\folder-slug\\folder-slug.html.twig");
    }
}
