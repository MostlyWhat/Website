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

/* forms/field.html.twig */
class __TwigTemplate_8a54c5c1b0751e4127d4d5a9aa4c6b0476f96a532b79c7157b62fc16d83741c9 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
            'stylesheets' => [$this, 'block_stylesheets'],
            'javascript' => [$this, 'block_javascript'],
            'javascript_footer' => [$this, 'block_javascript_footer'],
            'field' => [$this, 'block_field'],
            'overridable' => [$this, 'block_overridable'],
            'contents' => [$this, 'block_contents'],
            'label' => [$this, 'block_label'],
            'group' => [$this, 'block_group'],
            'input' => [$this, 'block_input'],
            'global_attributes' => [$this, 'block_global_attributes'],
            'reset_field' => [$this, 'block_reset_field'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        $assetFunction = $this->env->getFunction('parse_assets')->getCallable();
        $assetVariables = [];
        if ($assetVariables && !is_array($assetVariables)) {
            throw new UnexpectedValueException('{% scripts with x %}: x is not an array');
        }
        $location = "head";
        if ($location && !is_string($location)) {
            throw new UnexpectedValueException('{% scripts in x %}: x is not a string');
        }
        $priority = isset($assetVariables['priority']) ? $assetVariables['priority'] : 0;
        ob_start();
        // line 2
        echo "    ";
        $this->displayBlock('stylesheets', $context, $blocks);
        // line 4
        echo "
    ";
        // line 5
        $this->displayBlock('javascript', $context, $blocks);
        $content = ob_get_clean();
        $assetFunction($content, $location, $priority);
        // line 9
        $assetFunction = $this->env->getFunction('parse_assets')->getCallable();
        $assetVariables = [];
        if ($assetVariables && !is_array($assetVariables)) {
            throw new UnexpectedValueException('{% scripts with x %}: x is not an array');
        }
        $location = "footer";
        if ($location && !is_string($location)) {
            throw new UnexpectedValueException('{% scripts in x %}: x is not a string');
        }
        $priority = isset($assetVariables['priority']) ? $assetVariables['priority'] : 0;
        ob_start();
        // line 10
        echo "    ";
        $this->displayBlock('javascript_footer', $context, $blocks);
        $content = ob_get_clean();
        $assetFunction($content, $location, $priority);
        // line 14
        $context["name"] = (($context["name"]) ?? ($this->getAttribute(($context["field"] ?? null), "name", [])));
        // line 15
        $context["default_value"] = (($context["default_value"]) ?? ($this->getAttribute(($context["field"] ?? null), "default", [])));
        // line 16
        $context["current_value"] = (($context["current_value"]) ?? (($context["value"] ?? null)));
        // line 17
        $context["has_value"] =  !(null === ($context["current_value"] ?? null));
        // line 18
        $context["value"] = ((($context["has_value"] ?? null)) ? (($context["current_value"] ?? null)) : (($context["default_value"] ?? null)));
        // line 20
        $this->displayBlock('field', $context, $blocks);
    }

    // line 2
    public function block_stylesheets($context, array $blocks = [])
    {
        // line 3
        echo "    ";
    }

    // line 5
    public function block_javascript($context, array $blocks = [])
    {
        // line 6
        echo "    ";
    }

    // line 10
    public function block_javascript_footer($context, array $blocks = [])
    {
        // line 11
        echo "    ";
    }

    // line 20
    public function block_field($context, array $blocks = [])
    {
        // line 21
        if (( !$this->getAttribute(($context["field"] ?? null), "isset", []) ||  !(null === ($context["value"] ?? null)))) {
            // line 22
            echo "    <div class=\"settings-param ";
            echo twig_escape_filter($this->env, twig_replace_filter($this->getAttribute(($context["field"] ?? null), "type", []), ["." => "-"]), "html", null, true);
            echo "\">
        ";
            // line 23
            $this->displayBlock('overridable', $context, $blocks);
            // line 29
            echo "        ";
            $this->displayBlock('contents', $context, $blocks);
            // line 70
            echo "    </div>
";
        }
    }

    // line 23
    public function block_overridable($context, array $blocks = [])
    {
        // line 24
        echo "        ";
        $context["field_overridable"] = ((($this->getAttribute(($context["field"] ?? null), "overridable", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "overridable", [])))) ? ($this->getAttribute(($context["field"] ?? null), "overridable", [])) : (((($this->getAttribute(($context["field"] ?? null), "overrideable", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "overrideable", [])))) ? ($this->getAttribute(($context["field"] ?? null), "overrideable", [])) : (true))));
        // line 25
        echo "        ";
        if ((($context["overrideable"] ?? null) && (($context["field_overridable"] ?? null) || ($context["has_value"] ?? null)))) {
            // line 26
            echo "            ";
            $this->loadTemplate("forms/override.html.twig", "forms/field.html.twig", 26)->display(twig_array_merge($context, ["scope" => ($context["scope"] ?? null), "name" => ($context["name"] ?? null), "field" => ($context["field"] ?? null)]));
            // line 27
            echo "        ";
        }
        // line 28
        echo "        ";
    }

    // line 29
    public function block_contents($context, array $blocks = [])
    {
        // line 30
        echo "            <span class=\"settings-param-title float-left\">
                ";
        // line 31
        $this->displayBlock('label', $context, $blocks);
        // line 42
        echo "            </span>
            <div class=\"settings-param-field\">
                ";
        // line 44
        $this->displayBlock('group', $context, $blocks);
        // line 68
        echo "            </div>
        ";
    }

    // line 31
    public function block_label($context, array $blocks = [])
    {
        // line 32
        echo "                    ";
        if ($this->getAttribute(($context["field"] ?? null), "description", [])) {
            // line 33
            echo "                        ";
            $context["description"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "description", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "DESC");
            // line 34
            echo "                        <span data-tip=\"";
            echo ($context["description"] ?? null);
            echo "\" data-tip-place=\"top-right\" aria-label=\"";
            echo twig_escape_filter($this->env, ($context["description"] ?? null), "html", null, true);
            echo "\" data-title=\"";
            echo twig_escape_filter($this->env, ($context["description"] ?? null), "html", null, true);
            echo "\">
                            ";
            // line 35
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
            echo "
                        </span>
                    ";
        } else {
            // line 38
            echo "                        ";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
            echo "
                    ";
        }
        // line 40
        echo "                    ";
        echo ((twig_in_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "validate", []), "required", []), [0 => "on", 1 => "true", 2 => 1])) ? ("<span class=\"required\">*</span>") : (""));
        echo "
                ";
    }

    // line 44
    public function block_group($context, array $blocks = [])
    {
        // line 45
        echo "                    ";
        $this->displayBlock('input', $context, $blocks);
        // line 67
        echo "                ";
    }

    // line 45
    public function block_input($context, array $blocks = [])
    {
        // line 46
        echo "                        <input
                                ";
        // line 48
        echo "                                name=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
                                value=\"";
        // line 49
        echo twig_escape_filter($this->env, twig_join_filter(($context["value"] ?? null), ", "), "html", null, true);
        echo "\"
                                ";
        // line 51
        echo "                                ";
        $this->displayBlock('global_attributes', $context, $blocks);
        // line 59
        echo "                                />

                        ";
        // line 61
        $this->displayBlock('reset_field', $context, $blocks);
        // line 66
        echo "                    ";
    }

    // line 51
    public function block_global_attributes($context, array $blocks = [])
    {
        // line 52
        echo "                                    ";
        if ($this->getAttribute(($context["field"] ?? null), "class", [], "any", true, true)) {
            echo " class=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "class", []), "html", null, true);
            echo "\" ";
        }
        // line 53
        echo "                                    ";
        if ($this->getAttribute(($context["field"] ?? null), "id", [], "any", true, true)) {
            echo " id=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "id", []), "html", null, true);
            echo "\" ";
        }
        // line 54
        echo "                                    ";
        if ($this->getAttribute(($context["field"] ?? null), "style", [], "any", true, true)) {
            echo " style=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "style", []), "html", null, true);
            echo "\" ";
        }
        // line 55
        echo "                                    ";
        if ($this->getAttribute(($context["field"] ?? null), "title", [], "any", true, true)) {
            echo " title=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "title", []), "html", null, true);
            echo "\" ";
        }
        // line 56
        echo "                                    ";
        if ($this->getAttribute(($context["field"] ?? null), "override_target", [], "any", true, true)) {
            echo " data-override-target=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "override_target", []), "html_attr");
            echo "\" ";
        }
        // line 57
        echo "                                    aria-label=\"";
        echo twig_escape_filter($this->env, twig_trim_filter(twig_title_string_filter($this->env, twig_replace_filter((($context["scope"] ?? null) . ($context["name"] ?? null)), ["." => " "]))), "html", null, true);
        echo "\"
                                ";
    }

    // line 61
    public function block_reset_field($context, array $blocks = [])
    {
        // line 62
        if (( !$this->getAttribute(($context["field"] ?? null), "reset_field", [], "any", true, true) || twig_in_filter($this->getAttribute(($context["field"] ?? null), "reset_field", []), [0 => "on", 1 => "true", 2 => 1]))) {
            // line 63
            echo "                                <span class=\"g-reset-field\" data-g-reset-field=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
            echo "\"><i class=\"fa  fa-fw fa-times-circle\" aria-hidden=\"true\"></i></span>
                            ";
        }
    }

    public function getTemplateName()
    {
        return "forms/field.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  299 => 63,  297 => 62,  294 => 61,  287 => 57,  280 => 56,  273 => 55,  266 => 54,  259 => 53,  252 => 52,  249 => 51,  245 => 66,  243 => 61,  239 => 59,  236 => 51,  232 => 49,  227 => 48,  224 => 46,  221 => 45,  217 => 67,  214 => 45,  211 => 44,  204 => 40,  198 => 38,  192 => 35,  183 => 34,  180 => 33,  177 => 32,  174 => 31,  169 => 68,  167 => 44,  163 => 42,  161 => 31,  158 => 30,  155 => 29,  151 => 28,  148 => 27,  145 => 26,  142 => 25,  139 => 24,  136 => 23,  130 => 70,  127 => 29,  125 => 23,  120 => 22,  118 => 21,  115 => 20,  111 => 11,  108 => 10,  104 => 6,  101 => 5,  97 => 3,  94 => 2,  90 => 20,  88 => 18,  86 => 17,  84 => 16,  82 => 15,  80 => 14,  75 => 10,  63 => 9,  59 => 5,  56 => 4,  53 => 2,  41 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/field.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\field.html.twig");
    }
}
