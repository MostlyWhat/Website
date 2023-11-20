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

/* forms/fields/select/select.html.twig */
class __TwigTemplate_acc31c8c098556b21b156de91aec38ee16bd81705c28f3cc510ab6b2588cdea9 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'input' => [$this, 'block_input'],
            'options' => [$this, 'block_options'],
            'reset_field' => [$this, 'block_reset_field'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"), "forms/fields/select/select.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    <select
            ";
        // line 6
        echo "            name=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
            ";
        // line 8
        echo "            ";
        $this->displayBlock("global_attributes", $context, $blocks);
        echo "
            ";
        // line 10
        echo "            ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autofocus", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "autofocus=\"autofocus\"";
        }
        // line 11
        echo "            ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "disabled=\"disabled\"";
        }
        // line 12
        echo "            ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "multiple", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "multiple=\"multiple\"";
        }
        // line 13
        echo "            ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "required", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "required=\"required\"";
        }
        // line 14
        echo "            ";
        if ($this->getAttribute(($context["field"] ?? null), "placeholder", [], "any", true, true)) {
            echo "data-placeholder=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "placeholder", []), "html", null, true);
            echo "\"";
        }
        // line 15
        echo "            ";
        if ($this->getAttribute(($context["field"] ?? null), "size", [], "any", true, true)) {
            echo "size=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "size", []), "html", null, true);
            echo "\"";
        }
        // line 16
        echo "            >

        ";
        // line 18
        $this->displayBlock('options', $context, $blocks);
        // line 30
        echo "    </select>
    ";
        // line 31
        $this->displayBlock('reset_field', $context, $blocks);
    }

    // line 18
    public function block_options($context, array $blocks = [])
    {
        // line 19
        echo "            ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["field"] ?? null), "options", []));
        foreach ($context['_seq'] as $context["key"] => $context["text"]) {
            // line 20
            echo "                <option
                        ";
            // line 22
            echo "                        ";
            if ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->is_selectedFunc($context["key"], ($context["value"] ?? null))) {
                echo "selected=\"selected\"";
            }
            // line 23
            echo "                        value=\"";
            echo twig_escape_filter($this->env, $context["key"], "html", null, true);
            echo "\"
                        ";
            // line 25
            echo "                        ";
            if (twig_in_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "options", []), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
                echo "disabled=\"disabled\"";
            }
            // line 26
            echo "                        ";
            if ($this->getAttribute($this->getAttribute(($context["field"] ?? null), "options", [], "any", false, true), "label", [], "any", true, true)) {
                echo "label=\"";
                echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["field"] ?? null), "options", []), "label", []), "html", null, true);
                echo "\"";
            }
            // line 27
            echo "                        >";
            echo twig_escape_filter($this->env, $context["text"], "html", null, true);
            echo "</option>
            ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['text'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 29
        echo "        ";
    }

    // line 31
    public function block_reset_field($context, array $blocks = [])
    {
    }

    public function getTemplateName()
    {
        return "forms/fields/select/select.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  149 => 31,  145 => 29,  136 => 27,  129 => 26,  124 => 25,  119 => 23,  114 => 22,  111 => 20,  106 => 19,  103 => 18,  99 => 31,  96 => 30,  94 => 18,  90 => 16,  83 => 15,  76 => 14,  71 => 13,  66 => 12,  61 => 11,  56 => 10,  51 => 8,  46 => 6,  43 => 4,  40 => 3,  31 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/select/select.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\select\\select.html.twig");
    }
}
