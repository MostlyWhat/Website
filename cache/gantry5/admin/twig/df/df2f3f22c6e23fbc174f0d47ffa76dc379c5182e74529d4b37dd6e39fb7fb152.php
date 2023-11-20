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

/* forms/fields/collection/list.html.twig */
class __TwigTemplate_786617f54cef5d2b5ef50a84f635ef7a611ce84d5d3f22bb19b211c5d5890260 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'field' => [$this, 'block_field'],
            'contents' => [$this, 'block_contents'],
            'label' => [$this, 'block_label'],
            'input' => [$this, 'block_input'],
            'collection_fields' => [$this, 'block_collection_fields'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"), "forms/fields/collection/list.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 4
        $context["value"] = (((( !$this->getAttribute(($context["field"] ?? null), "key", []) && twig_test_iterable(($context["value"] ?? null))) && twig_length_filter($this->env, ($context["value"] ?? null)))) ? ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->valuesFilter(($context["value"] ?? null))) : (($context["value"] ?? null)));
        // line 1
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 6
    public function block_field($context, array $blocks = [])
    {
        // line 7
        echo "    ";
        if ($this->getAttribute(($context["field"] ?? null), "is_current", [])) {
            // line 8
            echo "        ";
            // line 9
            echo "        ";
            $context["name"] = "";
            // line 10
            echo "        <div class=\"g-filter-actions\">
            <div class=\"g-panel-filters\" data-g-global-filter=\"\">
                <div class=\"search settings-block\">
                    ";
            // line 13
            $context["filter"] = ["element" => ".settings-param", "title" => ".settings-param-title, h4 .g-title", "fallback" => true];
            // line 14
            echo "                    <input type=\"text\" data-g-collapse-filter=\"";
            echo twig_escape_filter($this->env, twig_jsonencode_filter(($context["filter"] ?? null)), "html_attr");
            echo "\" placeholder=\"";
            echo twig_escape_filter($this->env, (($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILTER") . " ") . twig_capitalize_string_filter($this->env, ($context["group"] ?? null))), "html", null, true);
            echo "...\" aria-label=\"";
            echo twig_escape_filter($this->env, (($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILTER") . " ") . twig_capitalize_string_filter($this->env, ($context["group"] ?? null))), "html", null, true);
            echo "...\" role=\"search\">
                    <i class=\"fa fa-fw fa-search\" aria-hidden=\"true\"></i>
                </div>
                <button class=\"button\" type=\"button\" data-g-collapse-all=\"true\"><i class=\"far fa-fw fa-caret-square-up\" aria-hidden=\"true\"></i> ";
            // line 17
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_COLLAPSE_ALL"), "html", null, true);
            echo "</button>
                <button class=\"button\" type=\"button\" data-g-collapse-all=\"false\"><i class=\"far fa-fw fa-caret-square-down\" aria-hidden=\"true\"></i> ";
            // line 18
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EXPAND_ALL"), "html", null, true);
            echo "</button>
            </div>
        </div>
        <div class=\"cards-wrapper g-grid\">
            ";
            // line 22
            $context["labels"] = ["collapse" => $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_COLLAPSE"), "expand" => $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EXPAND")];
            // line 23
            echo "            ";
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["value"] ?? null));
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
            foreach ($context['_seq'] as $context["key"] => $context["val"]) {
                // line 24
                echo "                ";
                $context["title"] = ((($this->getAttribute(($context["field"] ?? null), "value", []) == $this->getAttribute(($context["field"] ?? null), "key", []))) ? ($context["key"]) : ($this->getAttribute($context["val"], $this->getAttribute(($context["field"] ?? null), "value", []), [], "array")));
                // line 25
                echo "                ";
                $context["id"] = ((((($context["route"] ?? null) . ".") . $context["key"]) . ".") . $this->getAttribute(($context["field"] ?? null), "value", []));
                // line 26
                echo "                <div class=\"card settings-block\">
                    <h4
                        data-g-collapse=\"";
                // line 28
                echo twig_escape_filter($this->env, twig_jsonencode_filter(twig_array_merge(($context["labels"] ?? null), ["collapsed" => false, "id" => ($context["id"] ?? null), "store" => false, "target" => "~ .inner-params"])), "html_attr");
                echo "\"
                    >
                        <span class=\"g-collapse\" data-title=\"";
                // line 30
                echo twig_escape_filter($this->env, $this->getAttribute(($context["labels"] ?? null), "collapse", []), "html", null, true);
                echo "\" data-tip=\"";
                echo twig_escape_filter($this->env, $this->getAttribute(($context["labels"] ?? null), "collapse", []), "html", null, true);
                echo "\" data-tip-place=\"top-right\"><i class=\"fa fa-fw fa-caret-up\" aria-hidden=\"true\"></i></span>
                        <span data-title-editable=\"";
                // line 31
                echo twig_escape_filter($this->env, ($context["title"] ?? null), "html", null, true);
                echo "\" data-collection-key=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter(((((($context["scope"] ?? null) . ".") . $context["key"]) . ".") . $this->getAttribute(($context["field"] ?? null), "value", []))), "html", null, true);
                echo "\" class=\"g-title\">";
                echo twig_escape_filter($this->env, ($context["title"] ?? null), "html", null, true);
                echo "</span>
                        <i class=\"fa fa-pencil fa-pencil-alt font-small\" aria-hidden=\"true\"  tabindex=\"0\" aria-label=\"";
                // line 32
                echo twig_escape_filter($this->env, twig_replace_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EDIT_TITLE"), ["%s" => ($context["title"] ?? null)]), "html", null, true);
                echo "\" data-title-edit=\"\"></i>
                    </h4>
                    <div class=\"inner-params\">
                        ";
                // line 35
                $this->displayBlock("collection_fields", $context, $blocks);
                echo "
                    </div>
                </div>
            ";
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
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['val'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 39
            echo "        </div>
    ";
        } else {
            // line 41
            echo "
        ";
            // line 42
            $context["can_reorder"] = ((($this->getAttribute(($context["field"] ?? null), "reorder", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "reorder", [])))) ? ($this->getAttribute(($context["field"] ?? null), "reorder", [])) : (true));
            // line 43
            echo "        ";
            $context["can_remove"] = ((($this->getAttribute(($context["field"] ?? null), "deletion", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "deletion", [])))) ? ($this->getAttribute(($context["field"] ?? null), "deletion", [])) : (true));
            // line 44
            echo "        ";
            $context["can_addnew"] = ((($this->getAttribute(($context["field"] ?? null), "add_new", [], "any", true, true) &&  !(null === $this->getAttribute(($context["field"] ?? null), "add_new", [])))) ? ($this->getAttribute(($context["field"] ?? null), "add_new", [])) : (true));
            // line 45
            echo "        <div class=\"settings-param ";
            echo twig_escape_filter($this->env, twig_replace_filter($this->getAttribute(($context["field"] ?? null), "type", []), ["." => "-"]), "html", null, true);
            echo "\">
            ";
            // line 46
            if (((($context["overrideable"] ?? null) && (( !$this->getAttribute(($context["field"] ?? null), "overridable", [], "any", true, true) || ($this->getAttribute(($context["field"] ?? null), "overridable", []) == true)) || ($context["has_value"] ?? null))) && ($this->getAttribute(($context["field"] ?? null), "type", []) != "container.set"))) {
                // line 47
                echo "                ";
                $this->loadTemplate("forms/override.html.twig", "forms/fields/collection/list.html.twig", 47)->display(twig_array_merge($context, ["scope" => ($context["scope"] ?? null), "name" => ($context["name"] ?? null), "field" => ($context["field"] ?? null)]));
                // line 48
                echo "            ";
            }
            // line 49
            echo "            ";
            $this->displayBlock('contents', $context, $blocks);
            // line 127
            echo "        </div>
    ";
        }
    }

    // line 49
    public function block_contents($context, array $blocks = [])
    {
        // line 50
        echo "                ";
        $context["field_route"] = twig_replace_filter((((($context["route"] ?? null) . ".") . ((($context["prefix"] ?? null)) ? ((($context["prefix"] ?? null) . ".")) : (""))) . ($context["name"] ?? null)), ["." => "/"]);
        // line 51
        echo "                <span class=\"settings-param-title float-left\">
                    ";
        // line 52
        $this->displayBlock('label', $context, $blocks);
        // line 61
        echo "                </span>
                <div class=\"settings-param-field\" data-field-name=\"";
        // line 62
        echo twig_escape_filter($this->env, ($context["name"] ?? null), "html", null, true);
        echo "\">
                    ";
        // line 63
        $this->displayBlock('input', $context, $blocks);
        // line 125
        echo "                </div>
            ";
    }

    // line 52
    public function block_label($context, array $blocks = [])
    {
        // line 53
        echo "                        ";
        if ($this->getAttribute(($context["field"] ?? null), "description", [])) {
            // line 54
            echo "                            ";
            $context["description"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "description", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "DESC");
            // line 55
            echo "                            <span aria-label=\"";
            echo twig_escape_filter($this->env, ($context["description"] ?? null), "html", null, true);
            echo "\" data-tip=\"";
            echo ($context["description"] ?? null);
            echo "\" data-tip-place=\"top-right\">";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
            echo "</span>
                        ";
        } else {
            // line 57
            echo "                            ";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
            echo "
                        ";
        }
        // line 59
        echo "                        ";
        echo ((twig_in_filter($this->getAttribute($this->getAttribute(($context["field"] ?? null), "validate", []), "required", []), [0 => "on", 1 => "true", 2 => 1])) ? ("<span class=\"required\">*</span>") : (""));
        echo "
                    ";
    }

    // line 63
    public function block_input($context, array $blocks = [])
    {
        // line 64
        echo "<div class=\"g5-collection-wrapper\">
                        <ul>";
        // line 66
        if ($this->getAttribute(($context["field"] ?? null), "fields", [])) {
            // line 67
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["value"] ?? null));
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
            foreach ($context['_seq'] as $context["key"] => $context["val"]) {
                // line 68
                echo "                                    ";
                if (($this->getAttribute(($context["field"] ?? null), "ajax", []) == true)) {
                    // line 69
                    echo "                                        <li data-collection-item=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "value", []), "html", null, true);
                    echo "\">
                                            ";
                    // line 70
                    $context["itemValue"] = ((($this->getAttribute(($context["field"] ?? null), "value", []) == $this->getAttribute(($context["field"] ?? null), "key", []))) ? ($context["key"]) : ($this->getAttribute($context["val"], $this->getAttribute(($context["field"] ?? null), "value", []), [], "array")));
                    // line 71
                    echo "                                            ";
                    if (($context["can_reorder"] ?? null)) {
                        echo "<i class=\"fa fa-reorder font-small item-reorder\" aria-hidden=\"true\"></i>";
                    }
                    // line 72
                    echo "                                            <a class=\"config-cog\" href=\"";
                    echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => ((($context["field_route"] ?? null) . "/") . $context["key"])], "method"), "html", null, true);
                    echo "\"><span data-title-editable=\"";
                    echo twig_escape_filter($this->env, ($context["itemValue"] ?? null), "html", null, true);
                    echo "\" class=\"g-title\">";
                    echo twig_escape_filter($this->env, ($context["itemValue"] ?? null), "html", null, true);
                    echo "</span></a>
                                            ";
                    // line 73
                    if (($context["can_remove"] ?? null)) {
                        echo "<i class=\"fa fa-fw fa-trash font-small\" aria-hidden=\"true\" data-collection-remove=\"\"></i>";
                    }
                    // line 74
                    echo "                                            ";
                    if (($context["can_addnew"] ?? null)) {
                        echo "<i class=\"far fa-fw fa-copy font-small\" aria-hidden=\"true\" data-collection-duplicate=\"\"></i>";
                    }
                    // line 75
                    echo "                                            <i class=\"fa fa-fw fa-pencil fa-pencil-alt font-small\" aria-hidden=\"true\" tabindex=\"0\" aria-label=\"";
                    echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EDIT_TITLE", ($context["itemValue"] ?? null)), "html", null, true);
                    echo "\" data-title-edit=\"\"></i>
                                        </li>
                                    ";
                } else {
                    // line 78
                    echo "                                        ";
                    $this->displayBlock('collection_fields', $context, $blocks);
                    // line 105
                    echo "                                    ";
                }
                // line 106
                echo "                                ";
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
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['val'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
        }
        // line 108
        echo "</ul>
                    </div>
                    <div>
                        <ul style=\"display: none\">
                            <li data-collection-nosort=\"\" data-collection-template=\"";
        // line 112
        echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "value", []), "html", null, true);
        echo "\" style=\"display: none;\">
                                ";
        // line 113
        if (($context["can_reorder"] ?? null)) {
            echo "<i class=\"fa fa-reorder font-small item-reorder\" aria-hidden=\"true\"></i>";
        }
        // line 114
        echo "                                <a class=\"config-cog\" href=\"";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => (($context["field_route"] ?? null) . "/%id%")], "method"), "html", null, true);
        echo "\"><span data-title-editable=\"New item\" class=\"title\">New item</span></a>
                                ";
        // line 115
        if (($context["can_remove"] ?? null)) {
            echo "<i class=\"fa fa-fw fa-trash font-small\" aria-hidden=\"true\" data-collection-remove=\"\"></i>";
        }
        // line 116
        echo "                                ";
        if (($context["can_addnew"] ?? null)) {
            echo "<i class=\"far fa-fw fa-copy font-small\" aria-hidden=\"true\" data-collection-duplicate=\"\"></i>";
        }
        // line 117
        echo "                                <i class=\"fa fa-fw fa-pencil fa-pencil-alt font-small\" aria-hidden=\"true\" data-title-edit=\"\"></i>
                            </li>
                        </ul>
                        ";
        // line 120
        if (($context["can_addnew"] ?? null)) {
            echo "<span class=\"collection-addnew button button-simple\" data-collection-addnew=\"\" title=\"Add new item\"><i class=\"fa fa-plus font-small\" aria-hidden=\"true\"></i></span>";
        }
        // line 121
        echo "                        <a href=\"";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => ($context["field_route"] ?? null)], "method"), "html", null, true);
        echo "\" class=\"collection-editall button button-simple\" data-collection-editall=\"\" title=\"Edit all items\" ";
        if ((twig_length_filter($this->env, ($context["value"] ?? null)) <= 1)) {
            echo "style=\"display: none;\"";
        }
        echo "><i class=\"fa fa-th-large font-small\" aria-hidden=\"true\"></i></a>
                    </div>
                    <input data-collection-data=\"\" name=\"";
        // line 123
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter(((($context["scope"] ?? null) . ($context["name"] ?? null)) . "._json")), "html", null, true);
        echo "\" type=\"hidden\" value=\"";
        echo twig_escape_filter($this->env, twig_jsonencode_filter(((array_key_exists("value", $context)) ? (_twig_default_filter(($context["value"] ?? null), [])) : ([])), twig_constant("JSON_UNESCAPED_SLASHES")), "html_attr");
        echo "\"/>
                    ";
    }

    // line 78
    public function block_collection_fields($context, array $blocks = [])
    {
        // line 79
        echo "                                            <div data-g5-collections=\"\">
                                                ";
        // line 80
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
            // line 81
            echo "                                                    ";
            $context["container"] = (is_string($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = $this->getAttribute($context["child"], "type", [])) && is_string($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = "container.") && ('' === $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 || 0 === strpos($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4, $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144)));
            // line 82
            echo "                                                    ";
            if ((is_string($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b = $context["childName"]) && is_string($__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 = ".") && ('' === $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002 || 0 === strpos($__internal_1cfccaec8dd2e8578ccb026fbe7f2e7e29ac2ed5deb976639c5fc99a6ea8583b, $__internal_68aa442c1d43d3410ea8f958ba9090f3eaa9a76f8de8fc9be4d6c7389ba28002)))) {
                // line 83
                echo "                                                        ";
                $context["childKey"] = twig_trim_filter($context["childName"], ".");
                // line 84
                echo "                                                        ";
                $context["childValue"] = ((($context["container"] ?? null)) ? (($context["val"] ?? null)) : ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->nestedFunc(($context["val"] ?? null), ($context["childKey"] ?? null))));
                // line 85
                echo "                                                        ";
                $context["childName"] = (((($context["name"] ?? null) . ".") . ($context["key"] ?? null)) . $context["childName"]);
                // line 86
                echo "                                                    ";
            } else {
                // line 87
                echo "                                                        ";
                $context["childKey"] = $context["childName"];
                // line 88
                echo "                                                        ";
                $context["childValue"] = ((($context["container"] ?? null)) ? (($context["val"] ?? null)) : ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->nestedFunc(($context["data"] ?? null), (($context["scope"] ?? null) . ($context["childKey"] ?? null)))));
                // line 89
                echo "                                                        ";
                $context["childName"] = twig_replace_filter($context["childName"], ["*" => ($context["key"] ?? null)]);
                // line 90
                echo "                                                        ";
                $context["childParent"] = ((($context["childName"] == ($context["childKey"] ?? null))) ? ((("." . ($context["key"] ?? null)) . ".")) : (""));
                // line 91
                echo "                                                    ";
            }
            // line 92
            echo "
                                                    ";
            // line 93
            if (((!twig_in_filter($context["childName"], ($context["skip"] ?? null)) &&  !$this->getAttribute($context["child"], "skip", [])) && ($this->getAttribute(($context["field"] ?? null), "value", []) != ($context["childKey"] ?? null)))) {
                // line 94
                echo "                                                         ";
                if (($this->getAttribute($context["child"], "type", []) == "key")) {
                    // line 95
                    echo "                                                             ";
                    $this->loadTemplate("forms/fields/key/key.html.twig", "forms/fields/collection/list.html.twig", 95)->display(twig_array_merge($context, ["name" =>                     // line 96
$context["childName"], "field" => $context["child"], "value" => ($context["key"] ?? null), "current_value" => null, "default_value" => null, "parent" => ($context["childParent"] ?? null)]));
                    // line 97
                    echo "                                                         ";
                } elseif ($this->getAttribute($context["child"], "type", [])) {
                    // line 98
                    echo "                                                             ";
                    $this->loadTemplate([0 => (("forms/fields/" . twig_replace_filter($this->getAttribute($context["child"], "type", []), ["." => "/"])) . ".html.twig"), 1 => "forms/fields/unknown/unknown.html.twig"], "forms/fields/collection/list.html.twig", 98)->display(twig_array_merge($context, ["name" =>                     // line 99
$context["childName"], "field" => $context["child"], "value" => null, "current_value" => ($context["childValue"] ?? null), "default_value" => null, "parent_field" => ($context["childParent"] ?? null)]));
                    // line 100
                    echo "                                                        ";
                }
                // line 101
                echo "                                                    ";
            }
            // line 102
            echo "                                                ";
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
        // line 103
        echo "                                            </div>
                                        ";
    }

    public function getTemplateName()
    {
        return "forms/fields/collection/list.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  488 => 103,  474 => 102,  471 => 101,  468 => 100,  466 => 99,  464 => 98,  461 => 97,  459 => 96,  457 => 95,  454 => 94,  452 => 93,  449 => 92,  446 => 91,  443 => 90,  440 => 89,  437 => 88,  434 => 87,  431 => 86,  428 => 85,  425 => 84,  422 => 83,  419 => 82,  416 => 81,  399 => 80,  396 => 79,  393 => 78,  385 => 123,  375 => 121,  371 => 120,  366 => 117,  361 => 116,  357 => 115,  352 => 114,  348 => 113,  344 => 112,  338 => 108,  323 => 106,  320 => 105,  317 => 78,  310 => 75,  305 => 74,  301 => 73,  292 => 72,  287 => 71,  285 => 70,  280 => 69,  277 => 68,  260 => 67,  258 => 66,  255 => 64,  252 => 63,  245 => 59,  239 => 57,  229 => 55,  226 => 54,  223 => 53,  220 => 52,  215 => 125,  213 => 63,  209 => 62,  206 => 61,  204 => 52,  201 => 51,  198 => 50,  195 => 49,  189 => 127,  186 => 49,  183 => 48,  180 => 47,  178 => 46,  173 => 45,  170 => 44,  167 => 43,  165 => 42,  162 => 41,  158 => 39,  140 => 35,  134 => 32,  126 => 31,  120 => 30,  115 => 28,  111 => 26,  108 => 25,  105 => 24,  87 => 23,  85 => 22,  78 => 18,  74 => 17,  63 => 14,  61 => 13,  56 => 10,  53 => 9,  51 => 8,  48 => 7,  45 => 6,  41 => 1,  39 => 4,  33 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/collection/list.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\collection\\list.html.twig");
    }
}
