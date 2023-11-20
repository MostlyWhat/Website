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

/* forms/fields/input/group/group.html.twig */
class __TwigTemplate_f59e1612bb5415c5b96a88a540ba9e88b304010115b9382bac80121989f662bd extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'group' => [$this, 'block_group'],
            'input' => [$this, 'block_input'],
            'reset_field' => [$this, 'block_reset_field'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate(((($context["default"] ?? null)) ? ("partials/field.html.twig") : ((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"))), "forms/fields/input/group/group.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 18
        $context["macro"] = $this;
        // line 1
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 20
    public function block_group($context, array $blocks = [])
    {
        // line 21
        echo "    <div class=\"input-group";
        if ($this->getAttribute(($context["field"] ?? null), "prepend", [])) {
            echo " prepend";
        }
        if ($this->getAttribute(($context["field"] ?? null), "append", [])) {
            echo " append";
        }
        echo "\">
        ";
        // line 22
        if ($this->getAttribute(($context["field"] ?? null), "prepend", [])) {
            // line 23
            echo $context["macro"]->getpend($this->getAttribute(($context["field"] ?? null), "prepend", []));
        }
        // line 25
        $this->displayBlock('input', $context, $blocks);
        // line 27
        if ($this->getAttribute(($context["field"] ?? null), "append", [])) {
            // line 28
            echo $context["macro"]->getpend($this->getAttribute(($context["field"] ?? null), "append", []));
        }
        // line 30
        $this->displayBlock('reset_field', $context, $blocks);
        // line 31
        echo "    </div>
";
    }

    // line 25
    public function block_input($context, array $blocks = [])
    {
    }

    // line 30
    public function block_reset_field($context, array $blocks = [])
    {
        $this->displayParentBlock("reset_field", $context, $blocks);
    }

    // line 3
    public function getpend($__item__ = null, ...$__varargs__)
    {
        $context = $this->env->mergeGlobals([
            "item" => $__item__,
            "varargs" => $__varargs__,
        ]);

        $blocks = [];

        ob_start(function () { return ''; });
        try {
            // line 4
            echo "    ";
            if (($this->getAttribute(($context["item"] ?? null), "type", []) == "text")) {
                // line 5
                echo "        <span class=\"input-group-addon\">";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "text", []));
                echo "</span>
    ";
            } elseif (($this->getAttribute(            // line 6
($context["item"] ?? null), "type", []) == "list")) {
                // line 7
                echo "        ";
                if ($this->getAttribute(($context["item"] ?? null), "options", [])) {
                    // line 8
                    echo "            ";
                    $this->loadTemplate("forms/fields/select/selectize.html.twig", "forms/fields/input/group/group.html.twig", 8)->display(twig_array_merge($context, ["field.options" => $this->getAttribute(($context["item"] ?? null), "options", [])]));
                    // line 9
                    echo "        ";
                }
                // line 10
                echo "    ";
            } elseif (($this->getAttribute(($context["item"] ?? null), "type", []) == "button")) {
                // line 11
                echo "        <span class=\"input-group-btn\">
            ";
                // line 12
                $this->loadTemplate("forms/fields/button", "forms/fields/input/group/group.html.twig", 12)->display($context);
                // line 13
                echo "        </span>
    ";
            } elseif (($this->getAttribute(            // line 14
($context["item"] ?? null), "type", []) == "actions")) {
                // line 15
                echo "    ";
            }
        } catch (\Exception $e) {
            ob_end_clean();

            throw $e;
        } catch (\Throwable $e) {
            ob_end_clean();

            throw $e;
        }

        return ('' === $tmp = ob_get_clean()) ? '' : new Markup($tmp, $this->env->getCharset());
    }

    public function getTemplateName()
    {
        return "forms/fields/input/group/group.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  130 => 15,  128 => 14,  125 => 13,  123 => 12,  120 => 11,  117 => 10,  114 => 9,  111 => 8,  108 => 7,  106 => 6,  101 => 5,  98 => 4,  86 => 3,  80 => 30,  75 => 25,  70 => 31,  68 => 30,  65 => 28,  63 => 27,  61 => 25,  58 => 23,  56 => 22,  46 => 21,  43 => 20,  39 => 1,  37 => 18,  31 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/group/group.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\group\\group.html.twig");
    }
}
