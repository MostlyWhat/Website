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

/* forms/fields/menu/item.html.twig */
class __TwigTemplate_79f39a7cc1d5a805c528d8ea58ffa8be6a22883303fa98aac786b98e591e9dc2 extends \Twig\Template
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
        $this->parent = $this->loadTemplate("forms/fields/select/selectize.html.twig", "forms/fields/menu/item.html.twig", 1);
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
        if ( !(null === $this->getAttribute(($context["gantry"] ?? null), "menu", []))) {
            // line 6
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "menu", []), "getGroupedItems", [], "method"));
            foreach ($context['_seq'] as $context["group"] => $context["items"]) {
                // line 7
                echo "            ";
                if (twig_length_filter($this->env, $context["items"])) {
                    // line 8
                    echo "            <optgroup label=\"";
                    echo twig_escape_filter($this->env, twig_capitalize_string_filter($this->env, $context["group"]), "html", null, true);
                    echo "\">
            ";
                    // line 9
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($context["items"]);
                    foreach ($context['_seq'] as $context["key"] => $context["item"]) {
                        // line 10
                        echo "            <option
                    ";
                        // line 12
                        echo "                    ";
                        if (($context["key"] == ($context["value"] ?? null))) {
                            echo "selected=\"selected\"";
                        }
                        // line 13
                        echo "                    value=\"";
                        echo twig_escape_filter($this->env, $context["key"], "html", null, true);
                        echo "\"
                    ";
                        // line 15
                        echo "                    ";
                        if (twig_in_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "options", []), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
                            echo "disabled=\"disabled\"";
                        }
                        // line 16
                        echo "                    >";
                        echo $this->getAttribute($context["item"], "spacing", []);
                        echo twig_escape_filter($this->env, $this->getAttribute($context["item"], "label", []), "html", null, true);
                        echo "</option>
            ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['key'], $context['item'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 18
                    echo "            </optgroup>
            ";
                }
                // line 20
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['group'], $context['items'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 21
            echo "    ";
        }
    }

    public function getTemplateName()
    {
        return "forms/fields/menu/item.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  104 => 21,  98 => 20,  94 => 18,  84 => 16,  79 => 15,  74 => 13,  69 => 12,  66 => 10,  62 => 9,  57 => 8,  54 => 7,  49 => 6,  47 => 5,  42 => 4,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/menu/item.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\menu\\item.html.twig");
    }
}
