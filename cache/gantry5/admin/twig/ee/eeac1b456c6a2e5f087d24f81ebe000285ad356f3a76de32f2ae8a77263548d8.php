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

/* forms/fields/input/radios.html.twig */
class __TwigTemplate_451c0c5082c4f9f0c23a9a8bab5122b5a0d2bd82fd0540fd8275d83fc2d21c17 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'input' => [$this, 'block_input'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"), "forms/fields/input/radios.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["field"] ?? null), "options", []));
        foreach ($context['_seq'] as $context["key"] => $context["text"]) {
            // line 5
            echo "        ";
            $context["childName"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter(($context["name"] ?? null));
            // line 6
            echo "        ";
            $context["key"] = ((($this->getAttribute(($context["field"] ?? null), "use", []) == "keys")) ? ("1") : ($context["key"]));
            // line 7
            echo "        <span class=\"radios\">
            <input type=\"radio\"
                   id=\"";
            // line 9
            echo twig_escape_filter($this->env, ((($context["childName"] ?? null) . "-") . twig_lower_filter($this->env, $context["key"])), "html", null, true);
            echo "\"
                   value=\"";
            // line 10
            echo twig_escape_filter($this->env, $context["key"], "html", null, true);
            echo "\"
                   name=\"";
            // line 11
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["childName"] ?? null))), "html", null, true);
            echo "\"
                   ";
            // line 12
            if ((($context["value"] ?? null) == $context["key"])) {
                echo "checked=\"checked\"";
            }
            // line 13
            echo "                    ";
            if ($this->getAttribute($this->getAttribute(($context["field"] ?? null), "validate", []), "required", [])) {
                echo "required=\"required\"";
            }
            // line 14
            echo "            >
            <label for=\"";
            // line 15
            echo twig_escape_filter($this->env, ((($context["childName"] ?? null) . "-") . twig_lower_filter($this->env, $context["key"])), "html", null, true);
            echo "\">";
            echo twig_escape_filter($this->env, $context["text"], "html", null, true);
            echo "</label>
        </span>
    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['text'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "forms/fields/input/radios.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  80 => 15,  77 => 14,  72 => 13,  68 => 12,  64 => 11,  60 => 10,  56 => 9,  52 => 7,  49 => 6,  46 => 5,  41 => 4,  38 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/radios.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\radios.html.twig");
    }
}
