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

/* forms/fields/menu/list.html.twig */
class __TwigTemplate_382a993a33c54a391e9f2cabcd8e370fd562119f8999069c952ea4b1be901c54 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("forms/fields/select/selectize.html.twig", "forms/fields/menu/list.html.twig", 1);
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
        $context["current"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "menu", []), "getDefaultMenuName", [], "method");
        // line 6
        echo "    ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "menu", []), "getMenuOptions", [], "method"));
        foreach ($context['_seq'] as $context["menu_name"] => $context["menu_title"]) {
            // line 7
            echo "        <option
                ";
            // line 9
            echo "                ";
            if (($context["menu_name"] == ($context["value"] ?? null))) {
                echo "selected=\"selected\"";
            }
            // line 10
            echo "                value=\"";
            echo twig_escape_filter($this->env, $context["menu_name"], "html", null, true);
            echo "\"
                ";
            // line 12
            echo "                ";
            if (twig_in_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "options", []), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
                echo "disabled=\"disabled\"";
            }
            // line 13
            echo "                >";
            echo twig_escape_filter($this->env, $context["menu_title"], "html", null, true);
            echo ((((($context["current"] ?? null) == $context["menu_name"]) && $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "menu", []), "hasDefaultMenu", [], "method"))) ? (" ★") : (""));
            echo "</option>
    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['menu_name'], $context['menu_title'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "forms/fields/menu/list.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  72 => 13,  67 => 12,  62 => 10,  57 => 9,  54 => 7,  49 => 6,  47 => 5,  42 => 4,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/menu/list.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\menu\\list.html.twig");
    }
}
