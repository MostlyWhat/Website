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

/* forms/fields/input/section-variations.html.twig */
class __TwigTemplate_d92811853ac6186abdc95fbfedd796c0edeec12205b0a562cb1365011deea2ca extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'global_attributes' => [$this, 'block_global_attributes'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "forms/fields/input/selectize.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("forms/fields/input/selectize.html.twig", "forms/fields/input/section-variations.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_global_attributes($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context["variations"] = $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", []), "details", []), "configuration", []), "section-variations", [], "array");
        // line 5
        echo "    ";
        $context["Options"] = $this->getAttribute($this->getAttribute(($context["field"] ?? null), "selectize", []), "Options", []);
        // line 6
        echo "    ";
        $context["Optgroups"] = $this->getAttribute($this->getAttribute(($context["field"] ?? null), "selectize", []), "Optgroups", []);
        // line 7
        echo "    ";
        $context["options"] = [];
        // line 8
        echo "    ";
        $context["optgroups"] = [];
        // line 9
        echo "    ";
        if (($context["variations"] ?? null)) {
            // line 10
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["variations"] ?? null));
            foreach ($context['_seq'] as $context["key"] => $context["text"]) {
                // line 11
                echo "            ";
                if (twig_test_iterable($context["text"])) {
                    // line 12
                    echo "                ";
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($context["text"]);
                    foreach ($context['_seq'] as $context["item_key"] => $context["item_text"]) {
                        // line 13
                        echo "                    ";
                        $context["options"] = twig_array_merge(($context["options"] ?? null), [0 => ["optgroup" => $context["key"], "value" => $context["item_key"], "text" => $context["item_text"]]]);
                        // line 14
                        echo "                    ";
                        if (!twig_in_filter($context["key"], ($context["optgroups"] ?? null))) {
                            $context["optgroups"] = twig_array_merge(($context["optgroups"] ?? null), [0 => ["value" => $context["key"], "label" => $context["key"]]]);
                        }
                        // line 15
                        echo "                ";
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['item_key'], $context['item_text'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 16
                    echo "            ";
                } else {
                    // line 17
                    echo "                ";
                    $context["options"] = twig_array_merge(($context["options"] ?? null), [0 => ["value" => $context["key"], "text" => $context["text"]]]);
                    // line 18
                    echo "            ";
                }
                // line 19
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['text'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 20
            echo "

        ";
            // line 22
            $context["field"] = twig_array_merge(twig_array_merge(twig_array_merge(($context["field"] ?? null), (($this->getAttribute($this->getAttribute(($context["field"] ?? null), "selectize", [], "any", false, true), "Options", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "selectize", [], "any", false, true), "Options", []), [])) : ([]))), (($this->getAttribute($this->getAttribute(($context["field"] ?? null), "selectize", [], "any", false, true), "Optgroups", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "selectize", [], "any", false, true), "Optgroups", []), [])) : ([]))), ["selectize" => ["Options" => ($context["options"] ?? null), "Optgroups" => ($context["optgroups"] ?? null), "Subtitles" => true]]);
            // line 23
            echo "    ";
        }
        // line 24
        echo "
    data-selectize=\"";
        // line 25
        echo (($this->getAttribute(($context["field"] ?? null), "selectize", [], "any", true, true)) ? (twig_escape_filter($this->env, twig_jsonencode_filter($this->getAttribute(($context["field"] ?? null), "selectize", [])), "html_attr")) : (""));
        echo "\"
    ";
        // line 26
        $this->displayParentBlock("global_attributes", $context, $blocks);
        echo "
";
    }

    public function getTemplateName()
    {
        return "forms/fields/input/section-variations.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  118 => 26,  114 => 25,  111 => 24,  108 => 23,  106 => 22,  102 => 20,  96 => 19,  93 => 18,  90 => 17,  87 => 16,  81 => 15,  76 => 14,  73 => 13,  68 => 12,  65 => 11,  60 => 10,  57 => 9,  54 => 8,  51 => 7,  48 => 6,  45 => 5,  42 => 4,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/section-variations.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\section-variations.html.twig");
    }
}
