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

/* forms/fields/taxonomy/taxonomy.html.twig */
class __TwigTemplate_28f5fca1f848c62ed3d902713cbe6952fdbf5dfbc5ba2331234aa7e6406153ad extends \Twig\Template
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
        $this->parent = $this->loadTemplate("forms/field.html.twig", "forms/fields/taxonomy/taxonomy.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_field($context, array $blocks = [])
    {
        // line 4
        $context["object"] = $this->getAttribute(($context["form"] ?? null), "object", []);
        // line 5
        $context["taxonomies"] = (($context["taxonomies"]) ?? (((($this->getAttribute(($context["field"] ?? null), "taxonomies", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "taxonomies", [])))) ? ($this->getAttribute(($context["field"] ?? null), "taxonomies", [])) : (((($this->getAttribute($this->getAttribute(($context["admin"] ?? null), "data", [0 => "config/site"], "method", false, true), "taxonomies", [], "any", true, true) &&  !(null === $this->getAttribute($this->getAttribute(($context["admin"] ?? null), "data", [0 => "config/site"], "method", false, true), "taxonomies", [])))) ? ($this->getAttribute($this->getAttribute(($context["admin"] ?? null), "data", [0 => "config/site"], "method", false, true), "taxonomies", [])) : ([]))))));
        // line 6
        $context["parentname"] = $this->getAttribute(($context["field"] ?? null), "name", []);
        // line 7
        $context["options"] = $this->getAttribute(($context["field"] ?? null), "options", []);
        // line 8
        $context["default"] = $this->getAttribute(($context["field"] ?? null), "default", []);
        // line 9
        echo "
";
        // line 10
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["taxonomies"] ?? null));
        $context['loop'] = [
          'parent' => $context['_parent'],
          'index0' => 0,
          'index'  => 1,
          'first'  => true,
        ];
        if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
            $length = count($context['_seq']);
            $context['loop']['revindex0'] = $length - 1;
            $context['loop']['revindex'] = $length;
            $context['loop']['length'] = $length;
            $context['loop']['last'] = 1 === $length;
        }
        foreach ($context['_seq'] as $context["_key"] => $context["name"]) {
            // line 11
            echo "    ";
            $context["field_name"] = ((($context["parentname"] ?? null) . ".") . $context["name"]);
            // line 12
            echo "    ";
            $context["value"] = ((($context["form"] ?? null)) ? ($this->getAttribute(($context["form"] ?? null), "value", [0 => ($context["field_name"] ?? null)], "method")) : ($this->getAttribute(($context["data"] ?? null), "value", [0 => ($context["field_name"] ?? null)], "method")));
            // line 13
            echo "    ";
            $context["value"] = $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->arrayFilter((($context["value"]) ?? (((($this->getAttribute(($context["default"] ?? null), $context["name"], [], "array", true, true) &&  !(null === $this->getAttribute(($context["default"] ?? null), $context["name"], [], "array")))) ? ($this->getAttribute(($context["default"] ?? null), $context["name"], [], "array")) : ([])))));
            // line 14
            echo "    ";
            if (($context["object"] ?? null)) {
                // line 15
                echo "        ";
                $context["can_translate"] = (($context["can_translate"]) ?? (($this->getAttribute(($context["admin"] ?? null), "multilang", []) && $this->getAttribute(($context["object"] ?? null), "hasFlexFeature", [0 => "flex-translate"], "method"))));
                // line 16
                echo "        ";
                $context["index"] = $this->getAttribute($this->getAttribute(($context["object"] ?? null), "getFlexDirectory", [], "method"), "getIndex", [], "method");
                // line 17
                echo "        ";
                $context["translated"] = ((($context["can_translate"] ?? null)) ? ($this->getAttribute(($context["index"] ?? null), "withTranslated", [0 => $this->getAttribute(($context["admin"] ?? null), "language", [])], "method")) : (($context["index"] ?? null)));
                // line 18
                echo "        ";
                $context["sub_taxonomies"] = $this->getAttribute(($context["translated"] ?? null), "getDistinctValues", [0 => ($context["field_name"] ?? null)], "method");
                // line 19
                echo "    ";
            } else {
                // line 20
                echo "        ";
                $context["sub_taxonomies"] = twig_get_array_keys_filter(((($this->getAttribute($this->getAttribute($this->getAttribute(($context["grav"] ?? null), "taxonomy", [], "any", false, true), "taxonomy", [], "any", false, true), $context["name"], [], "any", true, true) &&  !(null === $this->getAttribute($this->getAttribute($this->getAttribute(($context["grav"] ?? null), "taxonomy", [], "any", false, true), "taxonomy", [], "any", false, true), $context["name"])))) ? ($this->getAttribute($this->getAttribute($this->getAttribute(($context["grav"] ?? null), "taxonomy", [], "any", false, true), "taxonomy", [], "any", false, true), $context["name"])) : ([])));
                // line 21
                echo "    ";
            }
            // line 22
            echo "    ";
            $context["list"] = array_unique(twig_array_merge(twig_array_merge(((($this->getAttribute(($context["options"] ?? null), $context["name"], [], "array", true, true) &&  !(null === $this->getAttribute(($context["options"] ?? null), $context["name"], [], "array")))) ? ($this->getAttribute(($context["options"] ?? null), $context["name"], [], "array")) : ([])), ($context["sub_taxonomies"] ?? null)), ($context["value"] ?? null)));
            // line 23
            echo "
    ";
            // line 24
            $context["field"] = ["type" => "select", "classes" => "fancy create", "label" => twig_capitalize_string_filter($this->env,             // line 27
$context["name"]), "name" =>             // line 28
($context["field_name"] ?? null), "multiple" => true, "options" =>             // line 30
($context["list"] ?? null), "style" => $this->getAttribute(            // line 31
($context["field"] ?? null), "style", []), "selectize" => ["create" => true]];
            // line 36
            echo "
    ";
            // line 37
            $this->loadTemplate("forms/fields/select/select.html.twig", "forms/fields/taxonomy/taxonomy.html.twig", 37)->display($context);
            ++$context['loop']['index0'];
            ++$context['loop']['index'];
            $context['loop']['first'] = false;
            if (isset($context['loop']['length'])) {
                --$context['loop']['revindex0'];
                --$context['loop']['revindex'];
                $context['loop']['last'] = 0 === $context['loop']['revindex0'];
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['name'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "forms/fields/taxonomy/taxonomy.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  120 => 37,  117 => 36,  115 => 31,  114 => 30,  113 => 28,  112 => 27,  111 => 24,  108 => 23,  105 => 22,  102 => 21,  99 => 20,  96 => 19,  93 => 18,  90 => 17,  87 => 16,  84 => 15,  81 => 14,  78 => 13,  75 => 12,  72 => 11,  55 => 10,  52 => 9,  50 => 8,  48 => 7,  46 => 6,  44 => 5,  42 => 4,  39 => 3,  29 => 1,);
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
{% set object = form.object %}
{% set taxonomies = taxonomies ?? field.taxonomies ?? admin.data('config/site').taxonomies ?? [] %}
{% set parentname = field.name %}
{% set options = field.options %}
{% set default = field.default %}

{% for name in taxonomies %}
    {% set field_name = parentname ~ '.' ~ name %}
    {% set value = form ? form.value(field_name) : data.value(field_name) %}
    {% set value = (value ?? default[name] ?? [])|array %}
    {% if object %}
        {% set can_translate = can_translate ?? (admin.multilang and object.hasFlexFeature('flex-translate')) %}
        {% set index = object.getFlexDirectory().getIndex() %}
        {% set translated = can_translate ? index.withTranslated(admin.language) : index %}
        {% set sub_taxonomies = translated.getDistinctValues(field_name) %}
    {% else %}
        {% set sub_taxonomies = (attribute(grav.taxonomy.taxonomy, name) ?? [])|keys %}
    {% endif %}
    {% set list = (options[name] ?? [])|merge(sub_taxonomies)|merge(value)|array_unique %}

    {% set field = {
        type: 'select',
        classes: 'fancy create',
        label: name|capitalize,
        name: field_name,
        multiple: true,
        options: list,
        style: field.style,
        selectize: {
            create: true
        }
    } %}

    {% include 'forms/fields/select/select.html.twig' %}
{% endfor %}
{% endblock %}
", "forms/fields/taxonomy/taxonomy.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\forms\\fields\\taxonomy\\taxonomy.html.twig");
    }
}
