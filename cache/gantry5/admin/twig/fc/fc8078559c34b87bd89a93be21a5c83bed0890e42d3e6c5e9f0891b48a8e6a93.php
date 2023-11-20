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

/* forms/fields/gantry/outlines.html.twig */
class __TwigTemplate_869ceb38c78107f705981ca3db299d81acaa7b41824c4bcc0680ee5151c89de6 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'options' => [$this, 'block_options'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "forms/fields/select/selectize.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("forms/fields/select/selectize.html.twig", "forms/fields/gantry/outlines.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_options($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $this->displayParentBlock("options", $context, $blocks);
        echo "
    ";
        // line 5
        if (( !$this->getAttribute(($context["field"] ?? null), "filter", []) || twig_in_filter("default", $this->getAttribute(($context["field"] ?? null), "filter", [])))) {
            // line 6
            echo "        <optgroup label=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_GLOBAL_DEFAULTS"), "html", null, true);
            echo "\">
        <option value=\"default\"";
            // line 7
            if (("default" == ($context["value"] ?? null))) {
                echo " selected=\"selected\"";
            }
            echo ">
            ";
            // line 8
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_BASE_OUTLINE"), "html", null, true);
            echo "
        </option>
    </optgroup>
    ";
        }
        // line 12
        echo "
    ";
        // line 13
        $context["user_conf"] = $this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "outlines", []), "user", []), "filter", [0 => $this->getAttribute(($context["field"] ?? null), "filter", [])], "method");
        // line 14
        echo "    ";
        if ($this->getAttribute(($context["user_conf"] ?? null), "count", [])) {
            // line 15
            echo "    <optgroup label=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_THEME_OUTLINES"), "html", null, true);
            echo "\">
        ";
            // line 16
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["user_conf"] ?? null));
            foreach ($context['_seq'] as $context["name"] => $context["title"]) {
                // line 17
                echo "            <option value=\"";
                echo twig_escape_filter($this->env, $context["name"], "html", null, true);
                echo "\"";
                if (($context["name"] == ($context["value"] ?? null))) {
                    echo " selected=\"selected\"";
                }
                echo ">
                ";
                // line 18
                echo twig_escape_filter($this->env, $context["title"], "html", null, true);
                echo "
            </option>
        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['name'], $context['title'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 21
            echo "    </optgroup>
    ";
        }
        // line 23
        echo "
    ";
        // line 24
        $context["system_conf"] = $this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "outlines", []), "system", []), "filter", [0 => $this->getAttribute(($context["field"] ?? null), "filter", [])], "method");
        // line 25
        echo "    ";
        if ($this->getAttribute(($context["system_conf"] ?? null), "count", [])) {
            // line 26
            echo "    <optgroup label=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SYSTEM_OUTLINES"), "html", null, true);
            echo "\">
        ";
            // line 27
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["system_conf"] ?? null));
            foreach ($context['_seq'] as $context["name"] => $context["title"]) {
                // line 28
                echo "            <option value=\"";
                echo twig_escape_filter($this->env, $context["name"], "html", null, true);
                echo "\"";
                if (($context["name"] == ($context["value"] ?? null))) {
                    echo " selected=\"selected\"";
                }
                echo ">
                ";
                // line 29
                echo twig_escape_filter($this->env, $context["title"], "html", null, true);
                echo "
            </option>
        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['name'], $context['title'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 32
            echo "    </optgroup>
    ";
        }
    }

    public function getTemplateName()
    {
        return "forms/fields/gantry/outlines.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  141 => 32,  132 => 29,  123 => 28,  119 => 27,  114 => 26,  111 => 25,  109 => 24,  106 => 23,  102 => 21,  93 => 18,  84 => 17,  80 => 16,  75 => 15,  72 => 14,  70 => 13,  67 => 12,  60 => 8,  54 => 7,  49 => 6,  47 => 5,  42 => 4,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/gantry/outlines.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\gantry\\outlines.html.twig");
    }
}
