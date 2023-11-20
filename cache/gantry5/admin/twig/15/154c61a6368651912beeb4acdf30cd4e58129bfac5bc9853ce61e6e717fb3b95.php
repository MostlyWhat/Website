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

/* forms/fields/collection/keyvalue.html.twig */
class __TwigTemplate_442c4bd2471f87e7f8863458e48e2fbf65529e4461592d4b8d73a72de21598df extends \Twig\Template
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
        return $this->loadTemplate((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"), "forms/fields/collection/keyvalue.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    <div class=\"g-keyvalue-field";
        if ($this->getAttribute(($context["field"] ?? null), "size", [])) {
            echo " g-keyvalue-";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "size", []), "html", null, true);
        }
        echo "\">
        <ul>";
        // line 6
        if (($context["value"] ?? null)) {
            // line 7
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["value"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["data"]) {
                // line 8
                echo "            ";
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($context["data"]);
                foreach ($context['_seq'] as $context["key"] => $context["val"]) {
                    // line 9
                    echo "            <li data-keyvalue-item=\"\">
                <i class=\"fa fa-reorder font-small item-reorder\" aria-hidden=\"true\"></i>
                <div class=\"g-keyvalue-wrapper\">
                    <input class=\"g-keyvalue-input-key\" type=\"text\" data-keyvalue-key=\"";
                    // line 12
                    echo twig_escape_filter($this->env, $context["key"], "html", null, true);
                    echo "\" value=\"";
                    echo twig_escape_filter($this->env, $context["key"], "html", null, true);
                    echo "\" ";
                    if ($this->getAttribute(($context["field"] ?? null), "key_placeholder", [], "any", true, true)) {
                        echo "placeholder=\"";
                        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "key_placeholder", []), "html", null, true);
                        echo "\"";
                    }
                    echo " />
                    <i class=\"g-keyvalue-sep fa fa-fw fa-arrow-right\"></i>
                    <input class=\"g-keyvalue-input-value\" type=\"text\" data-keyvalue-value=\"\" value=\"";
                    // line 14
                    echo twig_escape_filter($this->env, $context["val"], "html", null, true);
                    echo "\" ";
                    if ($this->getAttribute(($context["field"] ?? null), "value_placeholder", [], "any", true, true)) {
                        echo "placeholder=\"";
                        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "value_placeholder", []), "html", null, true);
                        echo "\"";
                    }
                    echo " />
                </div>
                <i class=\"fa fa-fw fa-trash font-small\" aria-hidden=\"true\" data-keyvalue-remove=\"\"></i>
            </li>
            ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['val'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 19
                echo "        ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['data'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 20
            echo "        ";
        }
        // line 21
        echo "</ul>

        <span class=\"button button-simple\" data-keyvalue-addnew=\"\" title=\"Add new item\"><i class=\"fa fa-plus font-small\" aria-hidden=\"true\"></i></span>
    </div>
    <ul style=\"display: none\">
        <li data-keyvalue-nosort=\"\" data-keyvalue-template=\"\">
            <i class=\"fa fa-reorder font-small item-reorder\" aria-hidden=\"true\"></i>
            <div class=\"g-keyvalue-wrapper\">
                <input class=\"g-keyvalue-input-key\" type=\"text\" data-keyvalue-key=\"\" value=\"\" ";
        // line 29
        if ($this->getAttribute(($context["field"] ?? null), "key_placeholder", [], "any", true, true)) {
            echo "placeholder=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "key_placeholder", []), "html", null, true);
            echo "\"";
        }
        echo " />
                <i class=\"g-keyvalue-sep fa fa-fw fa-arrow-right\"></i>
                <input class=\"g-keyvalue-input-value\" type=\"text\" data-keyvalue-value=\"\" value=\"\" ";
        // line 31
        if ($this->getAttribute(($context["field"] ?? null), "value_placeholder", [], "any", true, true)) {
            echo "placeholder=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "value_placeholder", []), "html", null, true);
            echo "\"";
        }
        echo " />
            </div>
            <i class=\"fa fa-fw fa-trash font-small\" aria-hidden=\"true\" data-keyvalue-remove=\"\"></i>
        </li>
    </ul>
    <input type=\"hidden\" data-keyvalue-data=\"\" data-keyvalue-exclude=\"";
        // line 36
        echo twig_escape_filter($this->env, twig_jsonencode_filter((($this->getAttribute(($context["field"] ?? null), "exclude", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "exclude", []), [])) : ([]))), "html_attr");
        echo "\" name=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter(((($context["scope"] ?? null) . ($context["name"] ?? null)) . "._json")), "html", null, true);
        echo "\" value=\"";
        echo twig_escape_filter($this->env, twig_jsonencode_filter(((array_key_exists("value", $context)) ? (_twig_default_filter(($context["value"] ?? null), [])) : ([])), twig_constant("JSON_UNESCAPED_SLASHES")), "html_attr");
        echo "\" />
";
    }

    public function getTemplateName()
    {
        return "forms/fields/collection/keyvalue.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  136 => 36,  124 => 31,  115 => 29,  105 => 21,  102 => 20,  96 => 19,  79 => 14,  66 => 12,  61 => 9,  56 => 8,  51 => 7,  49 => 6,  41 => 4,  38 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/collection/keyvalue.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\collection\\keyvalue.html.twig");
    }
}
