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

/* forms/fields/container/set.html.twig */
class __TwigTemplate_26e03fdba6628e30a75a7ec776c69b1ff205d78c58fb8e13d564b3f0cc29065a extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'overridable' => [$this, 'block_overridable'],
            'contents' => [$this, 'block_contents'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"), "forms/fields/container/set.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 4
    public function block_overridable($context, array $blocks = [])
    {
    }

    // line 7
    public function block_contents($context, array $blocks = [])
    {
        // line 8
        echo "    ";
        if ($this->getAttribute(($context["field"] ?? null), "label", [])) {
            // line 9
            echo "    <";
            echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "tag", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "tag", []), "h5")) : ("h5")), "html", null, true);
            echo ">";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
            echo "</";
            echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "tag", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "tag", []), "h5")) : ("h5")), "html", null, true);
            echo ">
    ";
        }
        // line 11
        echo "    <div";
        echo (($this->getAttribute(($context["field"] ?? null), "id", [])) ? (((" id=\"" . twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "id", []))) . "\"")) : (""));
        echo ">
    ";
        // line 12
        if ($this->getAttribute(($context["field"] ?? null), "fields", [])) {
            // line 13
            echo "        ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute(($context["field"] ?? null), "fields", []));
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
            foreach ($context['_seq'] as $context["childName"] => $context["child"]) {
                // line 14
                echo "            ";
                if ((is_string($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = $context["childName"]) && is_string($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = ".") && ('' === $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 || 0 === strpos($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4, $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144)))) {
                    // line 15
                    echo "                ";
                    $context["childValue"] = $this->getAttribute(($context["current_value"] ?? null), twig_slice($this->env, $context["childName"], 1, null), [], "array");
                    // line 16
                    echo "                ";
                    $context["childDefault"] = $this->getAttribute(($context["default_value"] ?? null), twig_slice($this->env, $context["childName"], 1, null), [], "array");
                    // line 17
                    echo "                ";
                    $context["childName"] = (($context["name"] ?? null) . $context["childName"]);
                    // line 18
                    echo "            ";
                } else {
                    // line 19
                    echo "                ";
                    $context["container"] = ($this->getAttribute($context["child"], "type", []) == "container.tabs");
                    // line 20
                    echo "                ";
                    $context["childValue"] = ((($context["container"] ?? null)) ? (($context["current_value"] ?? null)) : ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->nestedFunc(($context["data"] ?? null), (($context["scope"] ?? null) . $context["childName"]))));
                    // line 21
                    echo "                ";
                    $context["childDefault"] = ((($context["container"] ?? null)) ? (($context["default_value"] ?? null)) : ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->nestedFunc(($context["defaults"] ?? null), (($context["scope"] ?? null) . $context["childName"]))));
                    // line 22
                    echo "            ";
                }
                // line 23
                echo "            ";
                $context["child_overrideable"] = (($this->getAttribute($context["child"], "overridable", [], "any", true, true)) ? ($this->getAttribute($context["child"], "overridable", [])) : ((($this->getAttribute($context["child"], "overrideable", [], "any", true, true)) ? ($this->getAttribute($context["child"], "overrideable", [])) : (true))));
                // line 24
                echo "
            ";
                // line 25
                if (((($this->getAttribute($context["child"], "type", []) &&  !$this->getAttribute($context["child"], "skip", [])) &&  !((($context["ignore_not_overrideable"] ?? null) &&  !($context["child_overrideable"] ?? null)) && (null === ($context["childValue"] ?? null)))) &&  !((null === ($context["childValue"] ?? null)) && ($context["not_global_overrideable"] ?? null)))) {
                    // line 26
                    echo "                ";
                    $this->loadTemplate([0 => (("forms/fields/" . twig_replace_filter($this->getAttribute($context["child"], "type", []), ["." => "/"])) . ".html.twig"), 1 => "forms/fields/unknown/unknown.html.twig"], "forms/fields/container/set.html.twig", 26)->display(twig_array_merge($context, ["name" =>                     // line 27
$context["childName"], "field" => $context["child"], "current_value" => ($context["childValue"] ?? null), "value" => null, "default_value" => ($context["childDefault"] ?? null), "overrideable" => (($context["overrideable"] ?? null) && ($context["child_overrideable"] ?? null))]));
                    // line 28
                    echo "            ";
                }
                // line 29
                echo "        ";
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
            unset($context['_seq'], $context['_iterated'], $context['childName'], $context['child'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 30
            echo "    ";
        }
        // line 31
        echo "    </div>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/container/set.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  144 => 31,  141 => 30,  127 => 29,  124 => 28,  122 => 27,  120 => 26,  118 => 25,  115 => 24,  112 => 23,  109 => 22,  106 => 21,  103 => 20,  100 => 19,  97 => 18,  94 => 17,  91 => 16,  88 => 15,  85 => 14,  67 => 13,  65 => 12,  60 => 11,  50 => 9,  47 => 8,  44 => 7,  39 => 4,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/container/set.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\container\\set.html.twig");
    }
}
