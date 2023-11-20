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

/* forms/fields/columns/columns.html.twig */
class __TwigTemplate_a4bcec410f39265be79b6304b21a7b7276c353ca45feb938625b04abf9af786e extends \Twig\Template
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
        $this->parent = $this->loadTemplate("forms/field.html.twig", "forms/fields/columns/columns.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_field($context, array $blocks = [])
    {
        // line 4
        echo "<div class=\"form-columns grid pure-g\">
    ";
        // line 5
        $context["cols"] = twig_length_filter($this->env, $this->getAttribute(($context["field"] ?? null), "fields", []));
        // line 6
        echo "    ";
        $this->loadTemplate("forms/default/fields.html.twig", "forms/fields/columns/columns.html.twig", 6)->display(twig_array_merge($context, ["name" => $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->fieldParentFilter($this->getAttribute(($context["field"] ?? null), "name", [])), "fields" => $this->getAttribute(($context["field"] ?? null), "fields", []), "fallback_field" => "column", "cols" => ($context["cols"] ?? null)]));
        // line 7
        echo "</div>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/columns/columns.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  50 => 7,  47 => 6,  45 => 5,  42 => 4,  39 => 3,  29 => 1,);
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

{% block field %}
<div class=\"form-columns grid pure-g\">
    {% set cols = field.fields|length %}
    {% include 'forms/default/fields.html.twig' with {name: field.name|parent_field, fields: field.fields, fallback_field: 'column', cols: cols} %}
</div>
{% endblock %}
", "forms/fields/columns/columns.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\forms\\fields\\columns\\columns.html.twig");
    }
}
